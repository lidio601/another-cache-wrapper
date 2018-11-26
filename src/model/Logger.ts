/**
 * @author "Fabio Cigliano"
 * @created 3/11/18
 */

import { dummyLogger, Logger } from 'ts-log'

let logger : Logger = dummyLogger

export function setLogger(_logger: Logger) : void {
    logger = _logger
}

export default logger
