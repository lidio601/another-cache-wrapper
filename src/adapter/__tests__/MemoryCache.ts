/* global jest, describe, test */

jest.mock('super-cache')

import MemoryCache from '../MemoryCache'

describe('MemoryCache test', () => {
  const cache = new MemoryCache()

  test ('setup ok', () => {
    return expect(cache.setup()).resolves.toBe(cache)
  })

  test ('setup cached', () => {
    return expect(cache.setup()).resolves.toBe(cache)
  })

  test ('close', () => {
    return expect(cache.close()).resolves.toBeTruthy()
  })

  test ('setup ok', () => {
    return expect(cache.setup()).resolves.toBe(cache)
  })

  test ('get missing value', () => {
    return expect(cache.get('missing')).resolves.toBeNull()
  })

  test ('get reject', () => {
    return expect(cache.get('get error 1')).rejects.toThrow('get error 1')
  })

  test ('get throws', () => {
    return expect(cache.get('get error 2')).rejects.toThrow('get error 2')
  })

  test ('set', () => {
    return expect(cache.set('new', 'value')).resolves.toBe('value')
  })

  test ('set reject', () => {
    return expect(cache.set('set error 1', 'value')).rejects.toThrow('set error 1')
  })

  test ('set throws', () => {
    return expect(cache.set('set error 2', 'value')).rejects.toThrow('set error 2')
  })

  test ('forget', () => {
    return expect(cache.forget('todelete')).resolves.toBeTruthy()
  })

  test ('forget reject', () => {
    return expect(cache.forget('delete error 1')).resolves.toBeTruthy()
  })

  test ('forget throws', () => {
    return expect(cache.forget('delete error 2')).resolves.toBeTruthy()
  })

  test ('cacheKey', () => {
    return expect(cache.get(['complex'])).resolves.toBe('ok')
  })
})
