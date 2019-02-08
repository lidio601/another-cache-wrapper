
const instance = {}

let val = null

const mock = function (opts) {
  console.log('super-cache opts', opts)

  if (opts && opts.path && opts.path === 'mocked setup error') {
    throw new Error(opts.path)
  }

  this.get = function (key, cb) {
    console.log('MOCKED super-cache :: get ::', key, instance)
    if (key === 'missing') return cb(null, null)
    if (key === 'value') return cb(null, 'value')
    if (key === '554c3dd35b00a1f27cc6491e858cc40e878eb539') return cb(null, 'ok')
    if (key === 'get error 1') return cb(new Error('get error 1'))
    if (key === 'get error 2') throw new Error('get error 2')
    if (key === 'addTest') return cb(null, instance.addTest || null)
    // throw new Error('mocked get not implemented for key: ' + key)
    if (key === 'TEST_989db2448f309bfdd99b513f37c84b8f5794d2b5') return cb(null, val)
    if (key === 'TEST3_989db2448f309bfdd99b513f37c84b8f5794d2b5') return cb(null, 10)
    return cb(null)
  }

  this.set = function (key, value, ttl, cb) {
    console.log('MOCKED super-cache :: set ::', key, value, instance)
    if (key === 'set error 1') return cb(new Error('set error 1'))
    if (key === 'set error 2') throw new Error('set error 2')
    if (key === 'addTest') instance.addTest = value
    if (key === 'TEST_989db2448f309bfdd99b513f37c84b8f5794d2b5') val = value
    return cb(null, value)
  }

  this.delete = function (key, cb) {
    console.log('MOCKED super-cache :: delete ::', key)
    if (key === 'delete error 1') return cb(new Error('delete error 1'))
    if (key === 'delete error 2') throw new Error('delete error 2')
    if (key === 'todelete') return cb(null)
  }

  return this
}

module.exports = {
  LocalStore: mock,
  MemoryStore: mock
}
