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
const cacheKey_1 = __importDefault(require("../cacheKey"));
const ttl_1 = require("../ttl");
const maxRecursionCount = 10;
/**
 * Base class for a cache wrapper
 */
class AbstractCache {
    tag() {
        return '[lib/cache]';
    }
    log(msg, arg) {
        console.log(this.tag(), msg, lodash_1.default.defaultTo(arg, {}));
    }
    error(msg, arg) {
        console.error(this.tag(), msg, lodash_1.default.defaultTo(arg, {}));
    }
    /**
     * @param {any} key
     * @param {any} value
     * @param {Number} ttl
     * @returns {Promise<any>}
     */
    add(key, value, ttl) {
        return this
            .get(key)
            .then(value => {
            if (value) {
                throw new Error('Already locked');
            }
            else {
                return this.set(key, value, ttl);
            }
        });
    }
    lock(key, ttl) {
        ttl = lodash_1.default.defaultTo(ttl, ttl_1.LOCK_TTL);
        key = cacheKey_1.default(key);
        let recursionCount = maxRecursionCount;
        var checkOrFail = () => this.add(key, ttl)
            .then(stored => {
            if (!stored) {
                this.log(`CACHE::${key}::ALREADY-LOCKED (recursion=${recursionCount})`);
            }
            else {
                this.log(`CACHE::${key}::LOCKED (recursion=${recursionCount})`);
            }
            return stored;
        }, err => {
            this.log(`CACHE::${key}::ALREADY-LOCKED (recursion=${recursionCount})`);
            return false;
        })
            .then(result => {
            // recursion exit condition
            if (!result && recursionCount-- > 0) {
                return bluebird_1.default
                    .delay(1000 * (11 - recursionCount))
                    // recursion here
                    .then(() => checkOrFail());
            }
            return result;
        });
        return checkOrFail();
    }
    unlock(key) {
        key = cacheKey_1.default(key);
        this.log(`CACHE::${key}::UNLOCKED`);
        return this.forget(key);
    }
}
exports.default = AbstractCache;
//# sourceMappingURL=AbstractCache.js.map