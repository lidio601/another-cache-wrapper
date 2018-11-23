
/**
 * @author "Fabio Cigliano"
 * @created 3/11/18
 */

import Promise from 'bluebird'
import { default as _ } from 'lodash'

import cacheKey from '../cacheKey'
import CacheOpts from './CacheOpts'
import { LOCK_TTL } from '../ttl'

const maxRecursionCount = 10

/**
 * Base class for a cache wrapper
 */
export default abstract class AbstractCache {

  protected cache : undefined|any

  protected tag () : string {
    return '[lib/cache]'
  }

  protected log (msg : any, arg ?: any) {
    console.log(this.tag(), msg, _.defaultTo(arg, {}))
  }

  protected error (msg : any, arg ?: any|Error) {
    console.error(this.tag(), msg, _.defaultTo(arg, {}))
  }

  /**
   * @param {CacheOpts} opts
   * @returns {Promise<AbstractCache>}
   */
  abstract setup(opts ?: CacheOpts) : Promise<AbstractCache>

  /**
   * @returns {Promise<boolean>}
   */
  abstract close() : Promise<boolean>
 
  /**
   * @param {any} key
   * @param {any} value
   * @param {Number} ttl
   * @returns {Promise<any>}
   */
  abstract set(key : any, value : any, ttl ?: number) : Promise<any>
 
  /**
   * @param {any} key
   * @param {any} value
   * @param {Number} ttl
   * @returns {Promise<any>}
   */
  add(key : any, value : any, ttl ?: number) : Promise<any> {
    return this
      .get(key)
      .then(value => {
        if (value) {
          throw new Error('Already locked')
        } else {
          return this.set(key, value, ttl)
        }
      })
  }

  /**
   * @param {any} key
   * @returns {Promise<null|any>}
   */
  abstract get(key : any) : Promise<null|any>

  /**
   * @param {any} key
   * @returns {Promise<boolean>}
   */
  abstract forget(key : any) : Promise<boolean>

  public lock (key : any, ttl : number) : Promise<boolean> {
    ttl = _.defaultTo(ttl, LOCK_TTL)
    key = cacheKey(key)
    let recursionCount = maxRecursionCount;
  
    var checkOrFail = () => 
      this.add(key, ttl)
  
        .then(stored => {
          if (!stored) {
            this.log(`CACHE::${key}::ALREADY-LOCKED (recursion=${recursionCount})`)
          } else {
            this.log(`CACHE::${key}::LOCKED (recursion=${recursionCount})`)
          }
  
          return stored
        }, err => {
          this.log(`CACHE::${key}::ALREADY-LOCKED (recursion=${recursionCount})`)

          return false
        })
  
        .then(result => {
          // recursion exit condition
          if (!result && recursionCount-- > 0) {
            return Promise
              .delay(1000 * (11 - recursionCount))
              // recursion here
              .then(() => checkOrFail())
          }
  
          return result
        })
  
    return checkOrFail()
  }
  
  public unlock (key : any) : Promise<boolean> {
    key = cacheKey(key)
  
    this.log(`CACHE::${key}::UNLOCKED`)
    return this.forget(key)
  }
}
