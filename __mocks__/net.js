
const _ = require('lodash')

exports.createConnection = function (opts, mainCb) {
  const test = expected => _.indexOf(_.values(opts), expected) !== -1

  this.end = function () {}
  this.destroy = function () {}

  this.on = function (event, cb) {
    if (test('error.com')) {
      if (_.isEqual(event, 'error')) {
        console.log('detected hostname example.com! returing error')
        return cb(new Error(`host ${opts.host} is NOT reachable through mocked net module`))
      }
    }

    if (test('passthrough.error.com') && _.isEqual(event, 'data')) {
      console.log('detected hostname passthrough.example.com! returing data')
      return cb(`host ${opts.host} is reachable through mocked net module`)
    }

    if (_.isEqual(event, 'close')) {
      setTimeout(cb, 500)
    }
  }

  this.setTimeout = function (ttl, cb) {
    if (test('timeout.error.com')) {
      console.log('detected hostname timeout.example.com! returing timeout')
      setTimeout(() => (`host ${opts.host} is NOT reachable through mocked net module`), ttl)
    }
  }

  if (!test('error.com') && !test('timeout.error.com')) {
    setTimeout(mainCb, 200)
  }

  return this
}
