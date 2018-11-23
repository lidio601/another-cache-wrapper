/**
 * @author "Fabio Cigliano"
 * @created 3/11/18
 */

import { default as Memcached } from 'memcached'
import Promise from 'bluebird'
import { default as _ } from 'lodash/index'

import isReachable from 'tcp-reachability'

import AbstractCache from '../model/AbstractCache'
import CacheOpts from '../model/CacheOpts'
import cacheKey from '../cacheKey'
import { DEFAULT_TTL } from '../ttl'

 /**
 * Implements AbstractCache
 * and uses Memcached
 */
export default class MemCache extends AbstractCache {

  tag() {
    return '[lib/cache/memcached]'
  }

  setup(opts ?: CacheOpts) {
    const self : AbstractCache = this
    this.log('setup')

    if (this.cache) {
      return Promise.resolve(self)
    }

    // test if opts contains the memcached server parameter
    if (!_.has(opts, 'memcache') || !opts || _.isEmpty(opts.memcache)) {
      const err = new Error('missing MEMCACHED config')
      this.error('missing MEMCACHED config', opts)
      return Promise.reject(err)
    }

    // test memcached server reachability
    const url = 'http://' + opts.memcache
    return isReachable(url, false, true)
      .then(reachable => {
        this.log('memcached host reachability', {
          reachable,
          url
        })

        if (!reachable) {
          throw new Error('memcached host is not reachable!')
        }

        // https://hub.docker.com/_/memcached/
        // docker run --rm -it -p 11211:11211 memcached:alpine memcached -m 64
        // https://github.com/ctavan/node-memcached
        this.log('Connecting to memcached', { url })
        this.cache = new Memcached(opts.memcache, {})

        this.cache.on('failure', details =>
          this.log('Server ' + details.server + 'went down due to: ' + details.messages.join( '' ), details))

        this.cache.on('reconnecting', details =>
            this.log('Total downtime caused by server ' + details.server + ' :' + details.totalDownTime + 'ms', details))

        this.cache.on('issue', details =>
          this.log('Issue caused by server ' + details.server + ' :' + details.totalDownTime + 'ms', details))

        return this
      })
  }

  close() {
    this.log('closing')

    this.cache && this.cache.end()
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

  add(key : any, value : any, ttl ?: number) {
    return this
      .setup()
      .then(() => new Promise((resolve, reject) => {
        try {
          key = cacheKey(key)
          this.cache.add(key, value, ttl || DEFAULT_TTL, (err, value) => {
            if (err && err.notStored) resolve(false)
            else if (err) reject(err)
            else resolve(true)
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
          this.cache.del(key, err => {
            if (err) reject(err)
            else resolve(true)
          })
        } catch (err) {
          reject(err)
        }
    }))
  }
}
