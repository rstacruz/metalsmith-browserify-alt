var assign = require('object-assign')
var Promise = require('any-promise')

var join = require('path').join
var resolve = require('path').resolve
var dirname = require('path').dirname

/*
 * Returns a Metalsmith plugin.
 */

function browserifyPlugin (options) {
  return function (files, ms, done) {
    var promises = Object.keys(files).reduce(function (promises, fname) {
      if (!/\.browserify\.js$/.test(fname)) return promises
      var outFname = fname.replace(/\.browserify\.js$/, '.js')

      // Get browserify options. Make sure the cache is cleared for it
      // in the case of multiple builds per run (eg, metalsmith-start)
      var fullpath = join(ms.source(), fname)
      if (require.cache) delete require.cache[require.resolve(fullpath)]
      var bOptions = require(fullpath)

      // Invoke browserify
      var result = doBrowserify(bOptions, options || {})
      .then(function (result) {
        delete files[fname]
        files[outFname] = {
          path: outFname,
          contents: result.contents
        }
      })

      return promises.concat([ result ])
    }, [])

    // Wait for everything to finish
    Promise.all(promises)
      .then(function () { done() })
      .catch(function (err) { done(err) })
  }
}

/*
 * Invokes browserify; returns a Promise
 */

function doBrowserify (options, pluginOptions) {
  return new Promise(function (resolve, reject) {
    var b

    if (typeof options === 'function') {
      b = options(pluginOptions)
    } else {
      options = assign({}, pluginOptions.defaults || {}, options)
      b = require('browserify')(options)
    }

    b.bundle(function (err, buffer) {
      if (err) return reject(err)
      resolve({ contents: buffer })
    })
  })
}

module.exports = browserifyPlugin
