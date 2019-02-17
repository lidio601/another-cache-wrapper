"use strict";
/**
 * @author "Fabio Cigliano"
 * @created 3/11/18
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const object_hash_1 = __importDefault(require("object-hash"));
const index_1 = __importDefault(require("lodash/index"));
function cacheKey(key, prefixes) {
    let result = key;
    if (index_1.default.isArray(key) || index_1.default.isObject(key)) {
        // ensure it's a plain js object/array
        key = JSON.parse(JSON.stringify(key));
        // hash it!
        result = object_hash_1.default(key);
    }
    if (!index_1.default.isNil(prefixes)) {
        prefixes = index_1.default.flatten([prefixes]);
        prefixes = index_1.default.join(prefixes, '_');
        prefixes = index_1.default.toUpper(prefixes);
        result = index_1.default.join([prefixes, result], '_');
    }
    return result;
}
exports.default = cacheKey;
//# sourceMappingURL=cachekey.js.map