
const instance = {}

module.exports.createClient = function (opts) {
  console.log('iron-cache opts', opts)

  if (opts.project === 'mocked setup error') {
    throw new Error(opts.project)
  }

  this.get = function (namespace, key, cb) {
    if (key === 'missing') {
      return cb({
        message: 'Key not found.'
      })
    }
    if (key === 'value') return cb(null, {
      value: "value"
    })
    if (key === '554c3dd35b00a1f27cc6491e858cc40e878eb539') return cb(null, {
      value: '"ok"'
    })
    if (key === 'get error 1') return cb(new Error('get error 1'))
    if (key === 'get error 2') throw new Error('get error 2')
    if (key === 'addTest') return cb(null, instance.addTest || null)
    throw new Error('mocked get not implemented for key: ' + key)
  }

  this.put = function (namespace, key, param, cb) {
    if (key === 'set error 1') return cb(new Error('set error 1'))
    if (key === 'set error 2') throw new Error('set error 2')
    if (key === 'locked') return cb(new Error('Key already exists.'))
    if (key === 'addTest' && param.add && instance.addTest) return cb(new Error('Key already exists.'))
    if (key === 'addTest') instance.addTest = param.value
    return cb(null, JSON.parse(param.value))
  }

  this.del = function (namespace, key, cb) {
    if (key === 'delete error 1') return cb(new Error('delete error 1'))
    if (key === 'delete error 2') throw new Error('delete error 2')
    if (key === 'todelete') return cb(null)
  }

  return this
}
