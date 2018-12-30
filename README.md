# Standalone, stateless, bare minimum `path` utils for things

Standalone and stateless imply that this package works without any context, unlike Node's built-in path module
which sometimes will use `process.cwd()` to do its thing.

If you didn't pick up already, this package is intended to be used in web apps only. And for that reason code
size has been kept as little as possible.

Some differences from node's `path` module:
 - `splitPath` exported from this package splits path on each delimeter
 - Leading and trailing slashes are preserved when calling any path operation like `join`, `normalize` or `relative`
 - Trailing slashes can be removed using `removeTrailingSlashes` if you so desire

## Usage

### Install

```bash
npm i path-fx
```

### Use

```javascript
import {
    // platform auto-detected utils
    dirname, extname, // basename, ...
    // platform specific
    win32, unix
} from 'path-fx';

// platform auto-detected utils
console.log(dirname('/etc/ping/pong')); // > /etc/ping
console.log(extname('/etc/ping/pong/foo.js')); // > .js

// notice back slash in the output (unix delimits path(s) only on forward slashes)
console.log(unix.basename('/etc/ping/pong/foo\\bar.js')); // > foo\bar.js

// notice mixed slashes (win32 uses forward AND back slashes as folder separators)
console.log(win32.basename('C:\\etc/ping\\pong/foo\\bar.js')); // > bar.js

```

## API defined in `dist/typings/index.d.ts`

## Important note

This module will use `navigator.platform` to set initial path separator it'll use for exported functions.

~~It is advised that you set it manually with `path.setPathSeparator()` to be sure.~~

Moving from `1.5.1` to `2.0.0`, `setPathSeparator` was removed as it was a global operation and was an opportunity for accidental bugs in your codebase.
Instead, `2.0.0+` now exports `unix` and `win32` objects alongside auto-detected utils.
