"use strict";
/**
 * @author "Fabio Cigliano"
 * @created 3/11/18
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bluebird_1 = __importDefault(require("bluebird"));
const index_1 = __importDefault(require("lodash/index"));
const MemoryCache_1 = __importDefault(require("./adapter/MemoryCache"));
const FileCache_1 = __importDefault(require("./adapter/FileCache"));
const IronCache_1 = __importDefault(require("./adapter/IronCache"));
const MemCache_1 = __importDefault(require("./adapter/MemCache"));
const Logger_1 = require("./model/Logger");
const logger = Logger_1.getLogger();
let instance = false;
const TAG = '[lib/cache/factory]';
function factory(opts) {
    if (instance) {
        logger.trace(`${TAG} returning cached instance`);
        return bluebird_1.default.resolve(instance);
    }
    const test = (type) => {
        logger.trace(`${TAG} trying to instantiate ${type}`);
        let test = new type();
        return test.setup(opts);
    };
    // [IronCache, MemCache, FileCache]
    return test(IronCache_1.default)
        .catch(err => {
        logger.error(`${TAG} IronCache error`, err);
        return test(MemCache_1.default);
    })
        .catch(err => {
        logger.error(`${TAG} MemCache error`, err);
        return test(FileCache_1.default);
    })
        .catch(err => {
        logger.error(`${TAG} FileCache error`, err);
        return test(MemoryCache_1.default);
    })
        .catch(err => {
        logger.error(`${TAG} MemoryCache error`, err);
        throw err;
    })
        .then(_instance => {
        instance = _instance;
        logger.info(`${TAG} new instance created`, instance);
        // replace close function
        // to reset the internal state of this module
        const origClose = instance.close;
        index_1.default.assignIn(instance, {
            close: () => {
                if (!instance) {
                    return bluebird_1.default.resolve(true);
                }
                logger.info(`${TAG} close called`);
                return origClose.apply(instance, null)
                    .then(result => {
                    instance = false;
                    return result;
                })
                    .catch(err => {
                    instance = false;
                    throw err;
                });
            }
        });
        return instance;
    });
}
exports.default = factory;
//# sourceMappingURL=factory.js.map