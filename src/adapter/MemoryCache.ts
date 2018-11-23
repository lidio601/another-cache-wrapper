/**
 * @author "Fabio Cigliano"
 * @created 3/11/18
 */

import Promise from 'bluebird'
import _ from 'lodash'
import { MemoryStore } from 'super-cache'

import AbstractCache from '../model/AbstractCache'
import CacheOpts from '../model/CacheOpts'
import cacheKey from '../cacheKey'
import { DEFAULT_TTL } from '../ttl'

 /**
 * Implements AbstractCache
 * and uses the runtime memory
 * to cache keys
 */
export default class MemoryCache extends AbstractCache {

  tag() {
    return '[lib/cache/memory]'
  }

  setup(opts ?: CacheOpts) {
    const self : AbstractCache = this

    if (this.cache) {
      return Promise.resolve(self)
    }

    this.log('setup', opts)
    return Promise.resolve()
    .then(() => new Promise((resolve, reject) => {
      try {
        this.cache = new MemoryStore()

        resolve(this)
      } catch (err) {
        this.error("Error while connecting to filecache", err);

        reject(err)
      }
    }))
    .then(() => this)
  }

  close() {
    this.log('closing')

    this.cache = undefined

    return Promise.resolve(true)
  }

  set(key : any, value: any, ttl?: number) {
    return this
      .setup()
      .then(() => new Promise((resolve, reject) => {
        try {
          key = cacheKey(key)
          this.cache.set(key, value, ttl || DEFAULT_TTL, err => {
            if (err) reject(err)
            else resolve(value)
          });
        } catch (err) {
          reject(err)
        }
    }))
  }

  get(key : any) {
    return this
      .setup()
      .then(() => new Promise((resolve, reject) => {
        try {
          key = cacheKey(key)
          this.cache.get(key, (err, value) => {
            if (err) reject(err)
            else resolve(value || null)
          });
        } catch (err) {
          reject(err)
        }
    }))
  }

  forget(key : any) {
    return this
      .setup()
      .then(() => new Promise((resolve, reject) => {
        try {
          key = cacheKey(key)
          this.cache.delete(key, err => {
            if (err) reject(err)
            else resolve(true)
          })
        } catch (err) {
          reject(err)
        }
    }))
    .catch(err => true)
  }
}
