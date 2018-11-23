/* global jest, describe, test */

jest.mock('iron-cache')

import IronCache from '../IronCache'

describe('IronCache test', () => {
  const cache = new IronCache()

  test ('setup missin parameters', () => {
    return expect(cache.setup({
    })).rejects.toThrow('missing IRONCACHE config')
  })

  test ('setup error', () => {
    return expect(cache.setup({
      ironcache: {
        project: 'mocked setup error',
        name: 'foo',
        secret: 'foo'
      }
    })).rejects.toThrow('mocked setup error')
  })

  test ('setup ok', () => {
    return expect(cache.setup({
      ironcache: {
        project: 'foo',
        name: 'foo',
        secret: 'foo'
      }
    })).resolves.toBe(cache)
  })

  test ('setup cached', () => {
    return expect(cache.setup({
      ironcache: {
        project: 'mocked setup error',
        name: 'foo',
        secret: 'foo'
      }
    })).resolves.toBe(cache)
  })

  test ('close', () => {
    return expect(cache.close()).resolves.toBeTruthy()
  })
  test ('setup error', () => {
    return expect(cache.setup({
      ironcache: {
        project: 'mocked setup error',
        name: 'foo',
        secret: 'foo'
      }
    })).rejects.toThrow('mocked setup error')
  })

  test ('setup ok', () => {
    return expect(cache.setup({
      ironcache: {
        project: 'foo',
        name: 'foo',
        secret: 'foo'
      }
    })).resolves.toBe(cache)
  })

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

  test ('delete', () =>
    expect(cache.forget('todelete')).resolves.toBeTruthy())

  test ('delete missing', () =>
    expect(cache.forget('missing')).resolves.toBeTruthy())

  test ('delete reject', () =>
    expect(cache.forget('delete error 1')).rejects.toThrow('delete error 1'))

  test ('delete throws', () =>
    expect(cache.forget('delete error 2')).rejects.toThrow('delete error 2'))

  test ('cacheKey', () =>
    expect(cache.get(['complex'])).resolves.toBe('ok'))

  test ('add first call', () =>
    expect(cache.add('addTest', 1)).resolves.toBeTruthy())

  test ('add subsequent call', () =>
    expect(cache.add('addTest', 1)).rejects.toThrow())
})
