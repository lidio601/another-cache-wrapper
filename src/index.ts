/**
 * @author "Fabio Cigliano"
 * @created 3/11/18
 */

import Bluebird from 'bluebird'
import _ from 'lodash/index'

import AbstractCache from './model/AbstractCache'
import CacheOpts from './model/CacheOpts'
import factory from './factory'
import {default as _cacheKey} from './cacheKey'
import {default as ttl} from './ttl'
import { getLogger } from './model/Logger'

const logger = getLogger()
export const DEFAULT_TTL = ttl.DEFAULT_TTL
export const SHORT_TTL   = ttl.SHORT_TTL
export const MEDIUM_TTL  = ttl.MEDIUM_TTL
export const LONG_TTL    = ttl.LOCK_TTL
export const LOCK_TTL    = ttl.LOCK_TTL

export { setLogger } from './model/Logger'

export function cache (opts ?: CacheOpts) : Bluebird<AbstractCache> {
  return factory(opts)
}

export function cacheKey (key : any, prefixes ?: string[]|string) : string {
  return _cacheKey(key, prefixes)
}

export function cachedMethodCall (
  prefix : string[]|string,
  method : () => any,
  keyExtractor : () => any = _.identity,
  ttl : number = DEFAULT_TTL
) : () => Promise<any> {
  return async function () {
    const args = Array.prototype.slice.call(arguments, 0)
    const cache : AbstractCache = await factory()

    // extract the args to compose the cache key
    const partial : any = _.attempt(keyExtractor, args)

    // if this method fails return live result
    // like if it wasn't wrapped
    if (_.isError(partial)) {
      logger.error('cache :: error while extracting cachekey from args', partial)

      // fallback to call unwrapped method
      return method.apply(null, args)
    }

    // workout cache key for this params
    const cacheKey = _cacheKey(partial, prefix)

    // lookup in cache
    const cachedResult = await cache.get(cacheKey)

    // if result is found in cache
    if (!_.isNil(cachedResult)) {
      logger.debug('cache :: found cached result for', cacheKey)

      // return it
      return cachedResult
    }

    // otherwise call the function
    const liveResult = _.attempt(method, args)

    // if it raises an error
    if (_.isError(liveResult)) {
      // "return" it
      throw liveResult
    }

    // otherwise cache the result
    // for next call
    await cache.set(cacheKey, liveResult, ttl)

    return liveResult
  }
}
