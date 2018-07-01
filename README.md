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
import { dirname, extname, setPathSeparator } from 'path-fx';
console.log(dirname('/etc/ping/pong')); // > /etc/ping
console.log(basename('/etc/ping/pong/foo.js')); // > .js
```

## API defined in `dist/typings/index.d.ts`

## Important note

This module will use `navigator.platform` to set initial path separator it'll use. 
It is advised that you set it manually with `path.setPathSeparator()` to be sure.
