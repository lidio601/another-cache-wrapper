/**
 * @author "Fabio Cigliano"
 * @created 3/11/18
 */

import Promise from 'bluebird'
import _ from 'lodash'
import { LocalStore } from 'super-cache'

import MemoryCache from './MemoryCache'
import AbstractCache from '../model/AbstractCache'
import CacheOpts from '../model/CacheOpts'

 /**
 * Implements AbstractCache
 * and uses the local filesystem
 * to cache keys
 */
export default class FileCache extends MemoryCache {

  tag() {
    return '[lib/cache/file]'
  }

  setup(opts ?: CacheOpts) {
    const self : AbstractCache = this

    if (this.cache) {
      return Promise.resolve(self)
    }

    // test if opts contains the memcached server parameter
    if (!_.has(opts, 'cachedir')) {
      const err = new Error('missing CACHEDIR config')
      this.error('missing CACHEDIR config', opts)
      return Promise.reject(err)
    }

    this.log('setup', opts)
    return Promise.resolve()
    .then(() => new Promise((resolve, reject) => {
      try {
        this.cache = new LocalStore({
            type: 'local',
            prefix: 'cache_',
            path: _.get(opts, 'cachedir'),
            max: 1000,
            gcProbability: 0.01
        })

        resolve(this)
      } catch (err) {
        this.error("Error while connecting to filecache", err);

        reject(err)
      }
    }))
    .then(() => this)
  }
}
