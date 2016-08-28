# metalsmith-browserify-alt

> Minimal configuration Browserify integration for Metalsmith

This plugin lets you use [Browserify] to compile JavaScript for your [Metalsmith] sites.

<br>

## Installation

Install this npm package alongside `browserify`.

```sh
npm install --save --save-exact metalsmith-browserify-alt browserify
```

<br>

## Usage

0. Add the `metalsmith-browserify-alt` plugin to your *metalsmith.js* or *metalsmith.json*.
	
	```js
	/* metalsmith.json */

	{
	  "source": "./src",
	  "destination": "./public",
	  "plugins": {
	    "metalsmith-sense-browserify": {}
	  }
	}
	```
	
0. In your source directory, create a file named `[NAME].browserify.js` (replace *[NAME]* with your choice of filename). It will be compiled into `[NAME].js`.
	
		  
	```js
	/* src/app.browserify.js */
	
	// This will compile into `app.js`.
	// Below are the options to be passed onto Browserify.
	// The `entries` option defines what input file will be parsed.
	
	module.exports = {
	  entries: [ __dirname + '/../js/app.js' ],
	  transform: [ 'babelify' ]
	}
	```
	</details>
	
0. The actual file to be compiled by Browserify is defined in the `entries` option above. (It's recommended that these files not be placed inside the Metalsmith source directory to avoid being compiled on its own.)
	
	```js
	/* js/app.js */
	
	alert('Hello from browserify!')
	```

<br>

## API

> `require('metalsmith-sense-browserify')(options)`

Returns a Metalsmith plugin for compiling `*.browserify.js` files via Browserify. `options` is optional.

### Compiling files

The `*.browserify.js` files are expected to be files that will return an object. This object will be passed onto `browserify(...)`.

```js
// src/example.browserify.js
module.exports = { entries: [__dirname + '/../js/app.js'] }
```

See [browserify docs](https://www.npmjs.com/package/browserify#browserifyfiles--opts) for full details on options you can use. Common options include:

- `entries` — entry points for the JS bundle.
- `transform` — array of transform functions or module names.
- `plugin` - array of plugin functions or module names.
- `extensions` — array to be parsed; defaults to `['js', 'json']`.
- `standalone` — provides a UMD build if `true`.
- `debug` — adds source maps if `true`.

### Setting defaults

Set `options.defaults` to set options that will be used on all `.browserify.js` files.

See below for *recommended* options. This enables source maps and [watchify] for fast rebuilds (great with [metalsmith-start]).

```js
Metalsmith(__dirname)
  .use(require('metalsmith-sense-browserify')({
    defaults: {
      cache: {},
      packageCache: {},
      transform: ['babelify'],
      plugin: process.env.NODE_ENV === 'development' ? ['watchify'] : []
      debug: process.env.NODE_ENV === 'development'
    }
  })
```

<br>

## Extras

<details>
<summary>**metalsmith.js** — you may also configure this via metalsmith.js.</summary>

```js
var app = Metalsmith(__dirname)
  .source('./src')
  .destination('./public')
  .use(require('metalsmith-sense-browserify')({
    defaults: {
      cache: {},
      packageCache: {},
      transform: ['babelify'],
      plugin: process.env.NODE_ENV === 'development' ? ['watchify'] : [],
      debug: process.env.NODE_ENV === 'development'
    }
  })


if (module.parent) {
  module.exports = app
} else {
  app.build(function (err) { if (err) { console.error(err); process.exit(1) } })
}
```
</details>

<br>

## Prior art

This package is an alternative to [metalsmith-browserify]. It allows you to configure browserify bundles in Metalsmith source files rather than in metalsmith.js. It's also compatible with `metalsmith.json`.

[metalsmith-browserify]: https://www.npmjs.com/package/metalsmith-browserify
[watchify]: https://github.com/substack/watchify
[browserify]: http://browserify.org/
[Metalsmith]: http://metalsmith.io/
[metalsmith-start]: https://www.npmjs.com/package/metalsmith-start