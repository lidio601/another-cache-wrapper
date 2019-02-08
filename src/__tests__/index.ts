/* global jest, describe, test */

jest.mock('iron-cache')
jest.mock('memcached')
jest.mock('super-cache')
jest.mock('net')

import { cachedMethodCall} from '../index'

describe('Method wrapper', () => {
  test('test wrapped method - first call', () => {
    const toWrap = () => 10

    const wrapped = cachedMethodCall('test', toWrap)

    // first call
    return expect(wrapped()).resolves.toBe(10)
  })

  test('test wrapped method - second call', () => {
    const toWrap = () => 11

    const wrapped = cachedMethodCall('test3', toWrap)

    // cached call
    return expect(wrapped()).resolves.toBe(10)
  })

  test('test wrapped failing method', () => {
    const toWrap = () => {
      throw Error('custom')
    }

    const wrapped = cachedMethodCall('test2', toWrap)

    return expect(wrapped()).rejects.toThrow('custom')
  })

})
