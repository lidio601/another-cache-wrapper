/* global jest, describe, test */

jest.mock('memcached')
jest.mock('net')

import MemCache from '../MemCache'

describe('MemCache test', () => {
  const cache = new MemCache()

  test ('setup error', () => {
    return expect(cache.setup({
      memcache: 'passthrough.error.com',
    })).rejects.toThrow('passthrough.error.com')
  })

  test ('setup not reachable', () => {
    return expect(cache.setup({
      memcache: 'error.com',
    })).rejects.toThrow('memcached host is not reachable!')
  })
  
  test ('setup ok', () => {
    return expect(cache.setup({
      memcache: 'mc.example.com:1111'
    })).resolves.toBe(cache)
  })

  test ('setup cached', () => {
    return expect(cache.setup({
      memcache: 'mocked setup error',
    })).resolves.toBe(cache)
  })

  test ('close', () => {
    return expect(cache.close()).resolves.toBeTruthy()
  })

  test ('setup error', () => {
    return expect(cache.setup({
      memcache: 'error.com',
    })).rejects.toThrow('memcached host is not reachable!')
  })

  test ('setup ok', () => {
    return expect(cache.setup({
      memcache: 'mc.example.com:1111'
    })).resolves.toBe(cache)
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

  test ('delete', () => {
    return expect(cache.forget('todelete')).resolves.toBeTruthy()
  })

  test ('delete reject', () => {
    return expect(cache.forget('delete error 1')).rejects.toThrow('delete error 1')
  })

  test ('delete throws', () => {
    return expect(cache.forget('delete error 2')).rejects.toThrow('delete error 2')
  })

  test ('cacheKey', () => {
    return expect(cache.get(['complex'])).resolves.toBe('ok')
  })

  test ('add first call', () =>
    expect(cache.add('addTest', 1)).resolves.toBeTruthy())

  test ('add subsequent call', () =>
    expect(cache.add('addTest', 1)).rejects.toThrow())
})
