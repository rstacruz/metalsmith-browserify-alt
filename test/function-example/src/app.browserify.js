var browserify = require('browserify')

module.exports = function (options) {
  return browserify(__dirname + '/../js/app.js')
}
