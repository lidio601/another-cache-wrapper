/**
 * @author "Fabio Cigliano"
 * @created 3/11/18
 */

import Promise from 'bluebird'
import _ from 'lodash/index'

import AbstractCache from './model/AbstractCache'
import MemoryCache from './adapter/MemoryCache'
import FileCache from './adapter/FileCache'
import IronCache from './adapter/IronCache'
import MemCache from './adapter/MemCache'
import CacheOpts from './model/CacheOpts'
import logger from './model/Logger'

let instance : false | AbstractCache = false

const TAG = '[lib/cache/factory]'

export default function factory (opts ?: CacheOpts) : Promise<AbstractCache> {
  if (instance) {
    logger().debug(`${TAG} returning cached instance`)
    return Promise.resolve(instance)
  }

  const test = (type : new () => AbstractCache) : Promise<AbstractCache> => {
    logger().debug(`${TAG} trying to instantiate ${type}`)
    let test : AbstractCache = new type()
    return test.setup(opts)
  }

  // [IronCache, MemCache, FileCache]
  return test(IronCache)
    .catch(err => {
      logger().error(`${TAG} IronCache error`, err)
      return test(MemCache)
    })
    .catch(err => {
      logger().error(`${TAG} MemCache error`, err)
      return test(FileCache)
    })
    .catch(err => {
      logger().error(`${TAG} FileCache error`, err)
      return test(MemoryCache)
    })
    .catch(err => {
      logger().error(`${TAG} MemoryCache error`, err)
      throw err
    })
    .then(_instance => {
      instance = _instance
      logger().info(`${TAG} new instance created`, instance)
  
      // replace close function
      // to reset the internal state of this module
      const origClose = instance.close
      _.assignIn(instance, {
        close: () => {
          if (!instance) {
            return Promise.resolve(true)
          }
  
          logger().info(`${TAG} close called`)
          return origClose.apply(instance, null)
            .then(result => {
              instance = false
  
              return result
            })
            .catch(err => {
              instance = false
  
              throw err
            })
        }
      })
  
      return instance
    })
}
