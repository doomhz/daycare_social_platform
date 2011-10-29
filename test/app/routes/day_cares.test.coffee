app = require('../../../app')
assert = require('assert')

module.exports =
  'GET /day-cares': ()->
    assert.response app,
      url: '/day-cares',
      {
        status: 200
        headers:
          'Content-Type': 'application/json; charset=utf-8'
      },
      (res)->
        assert.includes res.body, '{"name":"daycare1"'
        assert.includes res.body, '{"name":"daycare2"'
        assert.includes res.body, '{"name":"daycare3"'
