/**
 * @author "Fabio Cigliano"
 * @created 3/11/18
 */

import hash from 'object-hash'
import _ from 'lodash/index'

export default function cacheKey (key : any, prefixes ?: string[]|string) : string {
  let result = key

  if (_.isArray(key) || _.isObject(key)) {
      result = hash(key)
  }

  if (!_.isEmpty(prefixes)) {
    prefixes = _.join(prefixes, '_')
    prefixes = _.toUpper(prefixes)
    result = _.join([prefixes, result], '_')
  }

  return result
}
