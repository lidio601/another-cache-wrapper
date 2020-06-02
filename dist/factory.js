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
const S3Cache_1 = __importDefault(require("./adapter/S3Cache"));
const Logger_1 = __importDefault(require("./model/Logger"));
let instance = false;
const TAG = '[lib/cache/factory]';
function factory(opts) {
    if (instance) {
        Logger_1.default().debug(`${TAG} returning cached instance`);
        return bluebird_1.default.resolve(instance);
    }
    const test = (type) => {
        Logger_1.default().debug(`${TAG} trying to instantiate ${type.constructor.name}`);
        let test = new type();
        return test.setup(opts);
    };
    return test(S3Cache_1.default)
        .catch(err => {
        Logger_1.default().debug(`${TAG} cannot create IronCache handler: ${err.message}`);
        return test(IronCache_1.default);
    })
        .catch(err => {
        Logger_1.default().debug(`${TAG} cannot create IronCache handler: ${err.message}`);
        return test(MemCache_1.default);
    })
        .catch(err => {
        Logger_1.default().debug(`${TAG} cannot create MemCache handler: ${err.message}`);
        return test(FileCache_1.default);
    })
        .catch(err => {
        Logger_1.default().debug(`${TAG} cannot create FileCache handler: ${err.message}`);
        return test(MemoryCache_1.default);
    })
        .catch(err => {
        Logger_1.default().debug(`${TAG} cannot create MemoryCache handler: ${err.message}`);
        throw err;
    })
        .then(_instance => {
        instance = _instance;
        Logger_1.default().info(`${TAG} initialized ${instance.constructor.name}`);
        // replace close function
        // to reset the internal state of this module
        const origClose = instance.close;
        index_1.default.assignIn(instance, {
            close: () => {
                if (!instance) {
                    return bluebird_1.default.resolve(true);
                }
                Logger_1.default().info(`${TAG} close called`);
                return origClose.apply(instance, [])
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