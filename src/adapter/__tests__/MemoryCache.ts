/* global jest, describe, test */

jest.mock('super-cache')

import MemoryCache from '../MemoryCache'

describe('MemoryCache test', () => {
  const cache = new MemoryCache()

  test ('setup ok', () =>
    expect(cache.setup()).resolves.toBe(cache))

  test ('setup cached', () =>
    expect(cache.setup()).resolves.toBe(cache))

  test ('close', () =>
    expect(cache.close()).resolves.toBeTruthy())

  test ('setup ok', () =>
    expect(cache.setup()).resolves.toBe(cache))

  test ('get missing value', () =>
    expect(cache.get('missing')).resolves.toBeNull())

  test ('get reject', () =>
    expect(cache.get('get error 1')).rejects.toThrow('get error 1'))

  test ('get throws', () =>
    expect(cache.get('get error 2')).rejects.toThrow('get error 2'))

  test ('set', () =>
    expect(cache.set('new', 'value')).resolves.toBe('value'))

  test ('set reject', () =>
    expect(cache.set('set error 1', 'value')).rejects.toThrow('set error 1'))

  test ('set throws', () =>
    expect(cache.set('set error 2', 'value')).rejects.toThrow('set error 2'))

  test ('forget', () =>
    expect(cache.forget('todelete')).resolves.toBeTruthy())

  test ('forget reject', () =>
    expect(cache.forget('delete error 1')).resolves.toBeTruthy())

  test ('forget throws', () =>
    expect(cache.forget('delete error 2')).resolves.toBeTruthy())

  test ('cacheKey', () =>
    expect(cache.get(['complex'])).resolves.toBe('ok'))

  test ('add first call', () =>
    expect(cache.add('addTest', 'foo', 1)).resolves.toBeTruthy())

  test ('add subsequent call', () =>
    expect(cache.add('addTest', 'foo', 1)).rejects.toThrow())
})
