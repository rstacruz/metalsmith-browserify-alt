var test = require('tape')
var join = require('path').join
var readFileSync = require('fs').readFileSync

test('example', function (t) {
  var ms = require('./example/metalsmith')
  t.plan(2)

  ms.build(function (err) {
    if (err) return t.end(err)

    var data = readFileSync(join(ms.destination(), 'app.js'), 'utf-8')
    t.assert(/exports/.test(data), 'browserify bundle')
    t.assert(/Hello from Browserify/.test(data), 'compiles properly')
    t.end()
  })
})

test('functions', function (t) {
  var ms = require('./test/function-example/metalsmith')
  t.plan(2)

  ms.build(function (err) {
    if (err) return t.end(err)

    var data = readFileSync(join(ms.destination(), 'app.js'), 'utf-8')
    t.assert(/exports/.test(data), 'browserify bundle')
    t.assert(/Hello from Browserify/.test(data), 'compiles properly')
    t.end()
  })
})
