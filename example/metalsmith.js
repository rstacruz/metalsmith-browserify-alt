var Metalsmith = require('metalsmith')

var app = Metalsmith(__dirname)
  .source('./src')
  .destination('./public')
  .use(require('../index')({
    defaults: {
      cache: {},
      packageCache: {},
      plugin: process.env.NODE_ENV === 'development' ? ['watchify'] : []
    }
  }))

if (module.parent) {
  module.exports = app
} else {
  app.build(function (err) { if (err) { console.error(err); process.exit(1) } })
}
