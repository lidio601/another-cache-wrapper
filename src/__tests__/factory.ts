/* global jest, describe, test */

jest.mock('iron-cache')
jest.mock('memcached')
jest.mock('super-cache')
jest.mock('net')

import factory from '../factory'
import MemoryCache from '../adapter/MemoryCache'
import FileCache from '../adapter/FileCache'
import MemCache from '../adapter/MemCache'
import IronCache from '../adapter/IronCache'

describe('Cache wrapper', () => {
  test('fallback to memory cache', () =>
    expect(factory())
      .resolves.toBeInstanceOf(MemoryCache))

  test('cached instance', () =>
    expect(factory())
      .resolves.toBeInstanceOf(MemoryCache))

  test('close cache', () =>
    expect(factory().then(c => c.close()))
      .resolves.toBeTruthy())

  test('fallback to file cache', () =>
    expect(factory({cachedir: './cache'}))
      .resolves.toBeInstanceOf(FileCache))

  test('cached instance', () =>
    expect(factory())
      .resolves.toBeInstanceOf(FileCache))

  test('close cache', () =>
    expect(factory().then(c => c.close()))
      .resolves.toBeTruthy())

  test('fallback to memcache', () =>
    expect(factory({ memcache: 'ok.example.com' }))
      .resolves.toBeInstanceOf(MemCache))

  test('cached instance', () =>
    expect(factory())
      .resolves.toBeInstanceOf(MemCache))

  test('close cache', () =>
    expect(factory().then(c => c.close()))
      .resolves.toBeTruthy())

  test('fallback to ironcache', () =>
    expect(factory({ ironcache: {
        name: 'foo',
        project: 'foo',
        secret: 'foo'
      }}))
      .resolves.toBeInstanceOf(IronCache))

  test('cached instance', () =>
    expect(factory())
      .resolves.toBeInstanceOf(IronCache))

  test('close cache', () =>
    expect(factory().then(c => c.close()))
      .resolves.toBeTruthy())

  test('subsequent close cache', () =>
    expect(factory().then(c => c.close()))
      .resolves.toBeTruthy())
})
