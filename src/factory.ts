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

let instance : false | AbstractCache = false

const TAG = '[lib/cache/factory]'

export default function factory (opts ?: CacheOpts) : Promise<AbstractCache> {
  if (instance) {
    return Promise.resolve(instance)
  }

  const test = (type : new () => AbstractCache) : Promise<AbstractCache> => {
    let test : AbstractCache = new type()

    return test.setup(opts)
  }

  // [IronCache, MemCache, FileCache]
  return test(IronCache)
    .catch(err => {
      return test(MemCache)
    })
    .catch(err => {
      return test(FileCache)
    })
    .catch(err => {
      return test(MemoryCache)
    })
    .then(_instance => {
      instance = _instance
      console.log(TAG, 'setup with', instance)
  
      const origClose = instance.close
      _.assignIn(instance, {
        close: () => {
          if (!instance) {
            return Promise.resolve(true)
          }
  
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
