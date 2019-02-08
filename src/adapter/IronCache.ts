/**
 * @author "Fabio Cigliano"
 * @created 3/11/18
 * @link https://www.npmjs.com/package/iron-cache
 */

import { createClient } from 'iron-cache'
import Promise from 'bluebird'
import { default as _ } from 'lodash/index'

import AbstractCache from '../model/AbstractCache'
import CacheOpts from '../model/CacheOpts'
import cacheKey from '../cacheKey'
import { DEFAULT_TTL } from '../ttl'
import { getLogger } from '../model/Logger'

const logger = getLogger()
const TAG = '[lib/cache/ironcache]'

 /**
 * Implements AbstractCache
 * and uses IronCache
 */
export default class IronCache extends AbstractCache {
  private name : undefined|string

  setup(opts ?: CacheOpts) {
    const self : AbstractCache = this

    if (this.cache) {
      return Promise.resolve(self)
    }

    // test if opts contains the ironcache server parameter
    logger.debug(`${TAG} setup`, opts)
    if (_.isUndefined(opts) || 
        !_.has(opts, 'ironcache') ||
        !opts.ironcache ||
        _.isEmpty(opts.ironcache) ||
        _.isEmpty(opts.ironcache.name) ||
        _.isEmpty(opts.ironcache.project) ||
        _.isEmpty(opts.ironcache.secret)) {
      const err = new Error('missing IRONCACHE config')

      return Promise.reject(err)
    }

    return Promise.resolve()
      .then(() => {
        this.name = _.get(opts, 'ironcache.name')
        this.cache = createClient({
          project: _.get(opts, 'ironcache.project'),
          token: _.get(opts, 'ironcache.secret'),
        })

        return this
      })
  }

  close() {
    logger.debug(`${TAG} closing`)
    this.cache = undefined
    return Promise.resolve(true)
  }

  set(key : any, value: any, ttl?: number) {
    const self : AbstractCache = this

    return this
      .setup()
      .then(() => new Promise((resolve, reject) => {
        try {
          key = cacheKey(key)
          // The value field must be a string or integer.
          this.cache.put(this.name, key, {
            value: JSON.stringify(value),
            expires_in: ttl || DEFAULT_TTL
          }, (err/*, res*/) => {
            /*
            res = {
                "msg": "Stored."
            }
            */
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
          this.cache.get(this.name, key, (err, res) => {
            /*
              res = {
                "cache": "CACHE NAME",
                "key": "ITEM KEY",
                "value": "ITEM VALUE",
                "cas": "12345"
              }
            */
            if (err && err.message === 'Cache not found.') resolve(undefined)
            if (err && err.message === 'Key not found.') resolve(undefined)
            if (err) reject(err)
            else resolve(res && res.value ? JSON.parse(res.value) : undefined)
          });
        } catch (err) {
          reject(err)
        }
    }))
    .then(result => _.isUndefined(result) ? null : result)
  }

  add(key : any, value : any, ttl ?: number) {
    return this
      .setup()
      .then(() => new Promise((resolve, reject) => {
        try {
          key = cacheKey(key)
          this.cache.put(this.name, key, {
            value: 1,
            expires_in: ttl || DEFAULT_TTL,
            add: true
          }, err => {
            // if (err && err.message === 'Key already exists.') return resolve(false)
            if (err) return reject(err)
            resolve(true)
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
          this.cache.del(this.name, key, (err/*, res*/) => {
            /*
              res = {
                "msg": "Deleted."
              }
            */
            if (err && err.message === "Key not found.") resolve(true)
            else if (err) reject(err)
            else resolve(true)
          })
        } catch (err) {
          reject(err)
        }
    }))
  }
}
