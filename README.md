# Standalone, stateless, bare minimum `path` utils for things

Standalone and stateless imply that this package works without any context, unlike Node's built-in path module
which sometimes will use `process.cwd()` to do its thing.

If you didn't pick up already, this package is intended to be used in web apps only. And for that reason code
size has been kept as little as possible.

## Usage

### Install

```bash
npm i path-fx
```

### Use

```javascript
import { dirname, extname, PathFx } from 'path-fx';

// platform auto-detected utils
console.log(dirname('/etc/ping/pong')); // > /etc/ping
console.log(extname('/etc/ping/pong/foo.js')); // > .js

// platform isolated utils: unix
const unixPathFx = new PathFx('unix')

// notice back slash in the output (unix delimits path(s) only on forward slashes)
console.log(unixPathFx.basename('/etc/ping/pong/foo\\bar.js')); // > foo\bar.js

// platform isolated utils: win32
const unixPathFx = new PathFx('win32')

// notice mixed slashes (win32 uses forward AND back slashes as folder separators)
console.log(unixPathFx.basename('C:\\etc/ping\\pong/foo\\bar.js')); // > bar.js

```

## API defined in `dist/typings/index.d.ts`

## Important note

This module will use `navigator.platform` to set initial path separator it'll use for exported functions.

~~It is advised that you set it manually with `path.setPathSeparator()` to be sure.~~

Moving from `1.5.1` to `2.0.0`, `setPathSeparator` was removed as it was a global operation and was an opportunity for accidental bugs in your codebase.
Instead, `2.0.0+` now exports `PathFx` object that can be run isolated per use case as shown in example above.
