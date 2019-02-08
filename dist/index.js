"use strict";
/**
 * @author "Fabio Cigliano"
 * @created 3/11/18
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = __importDefault(require("lodash/index"));
const factory_1 = __importDefault(require("./factory"));
const cacheKey_1 = __importDefault(require("./cacheKey"));
const ttl_1 = __importDefault(require("./ttl"));
const Logger_1 = require("./model/Logger");
const logger = Logger_1.getLogger();
exports.DEFAULT_TTL = ttl_1.default.DEFAULT_TTL;
exports.SHORT_TTL = ttl_1.default.SHORT_TTL;
exports.MEDIUM_TTL = ttl_1.default.MEDIUM_TTL;
exports.LONG_TTL = ttl_1.default.LOCK_TTL;
exports.LOCK_TTL = ttl_1.default.LOCK_TTL;
var Logger_2 = require("./model/Logger");
exports.setLogger = Logger_2.setLogger;
function cache(opts) {
    return factory_1.default(opts);
}
exports.cache = cache;
function cacheKey(key, prefixes) {
    return cacheKey_1.default(key, prefixes);
}
exports.cacheKey = cacheKey;
function cachedMethodCall(prefix, method, keyExtractor = index_1.default.identity, ttl = exports.DEFAULT_TTL) {
    return function () {
        return __awaiter(this, arguments, void 0, function* () {
            const args = Array.prototype.slice.call(arguments, 0);
            const cache = yield factory_1.default();
            // extract the args to compose the cache key
            const partial = index_1.default.attempt(keyExtractor, args);
            // if this method fails return live result
            // like if it wasn't wrapped
            if (index_1.default.isError(partial)) {
                logger.error('cache :: error while extracting cachekey from args', partial);
                // fallback to call unwrapped method
                return method.apply(null, args);
            }
            // workout cache key for this params
            const cacheKey = cacheKey_1.default(partial, prefix);
            // lookup in cache
            const cachedResult = yield cache.get(cacheKey);
            // if result is found in cache
            if (!index_1.default.isNil(cachedResult)) {
                logger.debug('cache :: found cached result for', cacheKey);
                // return it
                return cachedResult;
            }
            // otherwise call the function
            const liveResult = index_1.default.attempt(method, args);
            // if it raises an error
            if (index_1.default.isError(liveResult)) {
                // "return" it
                throw liveResult;
            }
            // otherwise cache the result
            // for next call
            yield cache.set(cacheKey, liveResult, ttl);
            return liveResult;
        });
    };
}
exports.cachedMethodCall = cachedMethodCall;
//# sourceMappingURL=index.js.map