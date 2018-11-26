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
import logger from '../model/Logger'

const TAG = '[lib/cache/file]'

 /**
 * Implements AbstractCache
 * and uses the local filesystem
 * to cache keys
 */
export default class FileCache extends MemoryCache {
  setup(opts ?: CacheOpts) {
    const self : AbstractCache = this

    if (this.cache) {
      return Promise.resolve(self)
    }

    // test if opts contains the memcached server parameter
    if (!_.has(opts, 'cachedir')) {
      const err = new Error('missing CACHEDIR config')

      return Promise.reject(err)
    }

    logger.debug(`${TAG} setup`, opts)
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
        logger.error(`${TAG} error while connecting to filecache`, err);

        reject(err)
      }
    }))
    .then(() => this)
  }
}
