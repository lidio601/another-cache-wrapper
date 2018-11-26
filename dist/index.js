"use strict";
/**
 * @author "Fabio Cigliano"
 * @created 3/11/18
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const factory_1 = __importDefault(require("./factory"));
const cacheKey_1 = __importDefault(require("./cacheKey"));
const ttl_1 = __importDefault(require("./ttl"));
exports.DEFAULT_TTL = ttl_1.default.DEFAULT_TTL;
exports.SHORT_TTL = ttl_1.default.SHORT_TTL;
exports.MEDIUM_TTL = ttl_1.default.MEDIUM_TTL;
exports.LONG_TTL = ttl_1.default.LOCK_TTL;
exports.LOCK_TTL = ttl_1.default.LOCK_TTL;
function cache(opts) {
    return factory_1.default(opts);
}
exports.cache = cache;
function cacheKey(key, prefixes) {
    return cacheKey_1.default(key, prefixes);
}
exports.cacheKey = cacheKey;
//# sourceMappingURL=index.js.map