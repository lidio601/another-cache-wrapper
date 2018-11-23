"use strict";
/**
 * @author "Fabio Cigliano"
 * @created 3/11/18
 * @link https://www.npmjs.com/package/iron-cache
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const iron_cache_1 = require("iron-cache");
const bluebird_1 = __importDefault(require("bluebird"));
const index_1 = __importDefault(require("lodash/index"));
const AbstractCache_1 = __importDefault(require("../model/AbstractCache"));
const cacheKey_1 = __importDefault(require("../cacheKey"));
const ttl_1 = require("../ttl");
/**
* Implements AbstractCache
* and uses IronCache
*/
class IronCache extends AbstractCache_1.default {
    tag() {
        return '[lib/cache/ironcache]';
    }
    setup(opts) {
        const self = this;
        this.log('setup');
        if (this.cache) {
            return bluebird_1.default.resolve(self);
        }
        // test if opts contains the ironcache server parameter
        if (index_1.default.isUndefined(opts) ||
            !index_1.default.has(opts, 'ironcache') ||
            !opts.ironcache ||
            index_1.default.isEmpty(opts.ironcache) ||
            index_1.default.isEmpty(opts.ironcache.name) ||
            index_1.default.isEmpty(opts.ironcache.project) ||
            index_1.default.isEmpty(opts.ironcache.secret)) {
            const err = new Error('missing IRONCACHE config');
            return bluebird_1.default.reject(err);
        }
        return bluebird_1.default.resolve()
            .then(() => {
            this.name = index_1.default.get(opts, 'ironcache.name');
            this.cache = iron_cache_1.createClient({
                project: index_1.default.get(opts, 'ironcache.project'),
                token: index_1.default.get(opts, 'ironcache.secret'),
            });
            return this;
        });
    }
    close() {
        this.log('closing');
        this.cache = undefined;
        return bluebird_1.default.resolve(true);
    }
    set(key, value, ttl) {
        const self = this;
        return this
            .setup()
            .then(() => new bluebird_1.default((resolve, reject) => {
            try {
                key = cacheKey_1.default(key);
                // The value field must be a string or integer.
                this.cache.put(this.name, key, {
                    value: JSON.stringify(value),
                    expires_in: ttl || ttl_1.DEFAULT_TTL
                }, (err /*, res*/) => {
                    /*
                    res = {
                        "msg": "Stored."
                    }
                    */
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
                this.cache.get(this.name, key, (err, res) => {
                    /*
                      res = {
                        "cache": "CACHE NAME",
                        "key": "ITEM KEY",
                        "value": "ITEM VALUE",
                        "cas": "12345"
                      }
                    */
                    if (err && err.message === 'Cache not found.')
                        resolve(undefined);
                    if (err && err.message === 'Key not found.')
                        resolve(undefined);
                    if (err)
                        reject(err);
                    else
                        resolve(res && res.value ? JSON.parse(res.value) : undefined);
                });
            }
            catch (err) {
                reject(err);
            }
        }))
            .then(result => index_1.default.isUndefined(result) ? null : result);
    }
    add(key, value, ttl) {
        return this
            .setup()
            .then(() => new bluebird_1.default((resolve, reject) => {
            try {
                key = cacheKey_1.default(key);
                this.cache.put(this.name, key, {
                    value: 1,
                    expires_in: ttl || ttl_1.DEFAULT_TTL,
                    add: true
                }, err => {
                    // if (err && err.message === 'Key already exists.') return resolve(false)
                    if (err)
                        return reject(err);
                    resolve(true);
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
                this.cache.del(this.name, key, (err /*, res*/) => {
                    /*
                      res = {
                        "msg": "Deleted."
                      }
                    */
                    if (err && err.message === "Key not found.")
                        resolve(false);
                    else if (err)
                        reject(err);
                    else
                        resolve(true);
                });
            }
            catch (err) {
                reject(err);
            }
        }));
    }
}
exports.default = IronCache;
//# sourceMappingURL=IronCache.js.map