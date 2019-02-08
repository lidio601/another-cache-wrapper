"use strict";
/**
 * @author "Fabio Cigliano"
 * @created 3/11/18
 */
Object.defineProperty(exports, "__esModule", { value: true });
const ts_log_1 = require("ts-log");
let logger = ts_log_1.dummyLogger;
function setLogger(_logger) {
    logger = _logger;
}
exports.setLogger = setLogger;
function getLogger() {
    return logger;
}
exports.getLogger = getLogger;
exports.default = getLogger;
//# sourceMappingURL=Logger.js.map