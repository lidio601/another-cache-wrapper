
const instance = {}

module.exports = function (opts) {
  this.on = function (event, cb) {}
  this.end = () => true

  console.log('memcached opts', opts)

  if (opts === 'passthrough.error.com') {
    throw new Error(opts)
  }

  this.get = function (key, cb) {
    console.log('MOCKED memcached :: get ::', key, instance)
    if (key === 'missing') return cb(null, null)
    if (key === 'value') return cb(null, 'value')
    if (key === '554c3dd35b00a1f27cc6491e858cc40e878eb539') return cb(null, 'ok')
    if (key === 'get error 1') return cb(new Error('get error 1'))
    if (key === 'get error 2') throw new Error('get error 2')
    if (key === 'addTest') return cb(null, instance.addTest || null)
    throw new Error('mocked get not implemented for key: ' + key)
  }

  this.set = function (key, value, ttl, cb) {
    console.log('MOCKED memcached :: set ::', key, value, instance)
    if (key === 'set error 1') return cb(new Error('set error 1'))
    if (key === 'set error 2') throw new Error('set error 2')
    if (key === 'addTest') instance.addTest = value
    return cb(null, value)
  }

  this.add = function (key, value, ttl, cb) {
    console.log('MOCKED memcached :: add ::', key, value, instance)
    if (key === 'add error 1') return cb(new Error('add error 1'))
    if (key === 'add error 2') throw new Error('add error 2')
    if (key === 'addTest' && instance.addTest) throw new Error('cannot add addTest')
    if (key === 'addTest') instance.addTest = value
    return cb(null, value)
  }

  this.del = function (key, cb) {
    if (key === 'delete error 1') return cb(new Error('delete error 1'))
    if (key === 'delete error 2') throw new Error('delete error 2')
    if (key === 'todelete') return cb(null)
  }

  return this
}
