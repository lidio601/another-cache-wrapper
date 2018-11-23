/**
 * @author "Fabio Cigliano"
 * @created 3/11/18
 */

import Promise from 'bluebird'
import _ from 'lodash/index'

import AbstractCache from './model/AbstractCache'
import CacheOpts from './model/CacheOpts'
import factory from './factory'
import {default as _cacheKey} from './cacheKey'
import {default as ttl} from './ttl'

const TAG = '[lib/cache]'

export const DEFAULT_TTL = ttl.DEFAULT_TTL
export const SHORT_TTL   = ttl.SHORT_TTL
export const MEDIUM_TTL  = ttl.MEDIUM_TTL
export const LONG_TTL    = ttl.LOCK_TTL
export const LOCK_TTL    = ttl.LOCK_TTL

export default function cache (opts ?: CacheOpts) : Promise<AbstractCache> {
  return factory(opts)
}

export function cacheKey(key : any, prefixes ?: string[]|string) : string {
  return _cacheKey(key, prefixes)
}
