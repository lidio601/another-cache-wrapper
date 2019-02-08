"use strict";
/**
 * @author "Fabio Cigliano"
 * @created 3/11/18
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const memcached_1 = __importDefault(require("memcached"));
const bluebird_1 = __importDefault(require("bluebird"));
const index_1 = __importDefault(require("lodash/index"));
const tcp_reachability_1 = __importStar(require("tcp-reachability"));
const AbstractCache_1 = __importDefault(require("../model/AbstractCache"));
const cacheKey_1 = __importDefault(require("../cacheKey"));
const ttl_1 = require("../ttl");
const Logger_1 = __importDefault(require("../model/Logger"));
tcp_reachability_1.setLogger(Logger_1.default());
const TAG = '[lib/cache/memcached]';
/**
* Implements AbstractCache
* and uses Memcached
*/
class MemCache extends AbstractCache_1.default {
    setup(opts) {
        const self = this;
        if (this.cache) {
            return bluebird_1.default.resolve(self);
        }
        // test if opts contains the memcached server parameter
        Logger_1.default().debug(`${TAG} setup`, opts);
        if (!index_1.default.has(opts, 'memcache') || !opts || index_1.default.isEmpty(opts.memcache)) {
            const err = new Error('missing MEMCACHED config');
            return bluebird_1.default.reject(err);
        }
        // test memcached server reachability
        const url = 'http://' + opts.memcache;
        return tcp_reachability_1.default(url, false)
            .then(reachable => {
            Logger_1.default().info(`${TAG} memcached host reachability`, {
                reachable,
                url
            });
            if (!reachable) {
                throw new Error('memcached host is not reachable!');
            }
            // https://hub.docker.com/_/memcached/
            // docker run --rm -it -p 11211:11211 memcached:alpine memcached -m 64
            // https://github.com/ctavan/node-memcached
            Logger_1.default().debug(`${TAG} connecting to memcached`, { url });
            this.cache = new memcached_1.default(opts.memcache, {});
            this.cache.on('failure', details => Logger_1.default().warn(`${TAG} server ${details.server} went down due to: ${details.messages.join('')}`, details));
            this.cache.on('reconnecting', details => Logger_1.default().info(`${TAG} total downtime caused by server ${details.server}: ${details.totalDownTime}ms`, details));
            this.cache.on('issue', details => Logger_1.default().info(`${TAG} issue caused by server ${details.server}: ${details.totalDownTime}ms`, details));
            return this;
        });
    }
    close() {
        Logger_1.default().debug(`${TAG} closing`);
        this.cache && this.cache.end() && (this.cache = undefined);
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
    add(key, value, ttl) {
        return this
            .setup()
            .then(() => new bluebird_1.default((resolve, reject) => {
            try {
                key = cacheKey_1.default(key);
                this.cache.add(key, value, ttl || ttl_1.DEFAULT_TTL, (err, value) => {
                    if (err && err.notStored)
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
    forget(key) {
        return this
            .setup()
            .then(() => new bluebird_1.default((resolve, reject) => {
            try {
                key = cacheKey_1.default(key);
                this.cache.del(key, err => {
                    if (err)
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
exports.default = MemCache;
//# sourceMappingURL=MemCache.js.map