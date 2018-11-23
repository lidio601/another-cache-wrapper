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
const lodash_1 = __importDefault(require("lodash"));
const super_cache_1 = require("super-cache");
const MemoryCache_1 = __importDefault(require("./MemoryCache"));
/**
* Implements AbstractCache
* and uses the local filesystem
* to cache keys
*/
class FileCache extends MemoryCache_1.default {
    tag() {
        return '[lib/cache/file]';
    }
    setup(opts) {
        const self = this;
        if (this.cache) {
            return bluebird_1.default.resolve(self);
        }
        // test if opts contains the memcached server parameter
        if (!lodash_1.default.has(opts, 'cachedir')) {
            const err = new Error('missing CACHEDIR config');
            this.error('missing CACHEDIR config', opts);
            return bluebird_1.default.reject(err);
        }
        this.log('setup', opts);
        return bluebird_1.default.resolve()
            .then(() => new bluebird_1.default((resolve, reject) => {
            try {
                this.cache = new super_cache_1.LocalStore({
                    type: 'local',
                    prefix: 'cache_',
                    path: lodash_1.default.get(opts, 'cachedir'),
                    max: 1000,
                    gcProbability: 0.01
                });
                resolve(this);
            }
            catch (err) {
                this.error("Error while connecting to filecache", err);
                reject(err);
            }
        }))
            .then(() => this);
    }
}
exports.default = FileCache;
//# sourceMappingURL=FileCache.js.map