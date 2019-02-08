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
const super_cache_1 = require("super-cache");
const AbstractCache_1 = __importDefault(require("../model/AbstractCache"));
const cacheKey_1 = __importDefault(require("../cacheKey"));
const ttl_1 = require("../ttl");
const Logger_1 = __importDefault(require("../model/Logger"));
const TAG = '[lib/cache/memory]';
/**
* Implements AbstractCache
* and uses the runtime memory
* to cache keys
*/
class MemoryCache extends AbstractCache_1.default {
    setup(opts) {
        const self = this;
        if (this.cache) {
            return bluebird_1.default.resolve(self);
        }
        Logger_1.default().debug(`${TAG} setup`, opts);
        return bluebird_1.default.resolve()
            .then(() => new bluebird_1.default((resolve, reject) => {
            try {
                this.cache = new super_cache_1.MemoryStore();
                resolve(this);
            }
            catch (err) {
                Logger_1.default().error(`${TAG} Error while connecting to memorycache`, err);
                reject(err);
            }
        }))
            .then(() => this);
    }
    close() {
        Logger_1.default().debug(`${TAG} closing`);
        this.cache = undefined;
        return bluebird_1.default.resolve(true);
    }
    set(key, value, ttl) {
        return this
            .setup()
            .then(() => new bluebird_1.default((resolve, reject) => {
            try {
                key = cacheKey_1.default(key);
                this.cache.set(key, value, ttl || ttl_1.DEFAULT_TTL, err => {
                    if (err)
                        reject(err);
                    else
                        resolve(value);
                });
            }
            catch (err) {
                reject(err);
            }
        }));
    }
    get(key) {
        return this
            .setup()
            .then(() => new bluebird_1.default((resolve, reject) => {
            try {
                key = cacheKey_1.default(key);
                this.cache.get(key, (err, value) => {
                    if (err)
                        reject(err);
                    else
                        resolve(value || null);
                });
            }
            catch (err) {
                reject(err);
            }
        }));
    }
    forget(key) {
        return this
            .setup()
            .then(() => new bluebird_1.default((resolve, reject) => {
            try {
                key = cacheKey_1.default(key);
                this.cache.delete(key, err => {
                    if (err)
                        reject(err);
                    else
                        resolve(true);
                });
            }
            catch (err) {
                reject(err);
            }
        }))
            .catch(err => true);
    }
}
exports.default = MemoryCache;
//# sourceMappingURL=MemoryCache.js.map