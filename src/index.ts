import { PathFx } from './PathFx'

const platform = /win32/i.test((typeof navigator === 'object' && navigator.platform) || (typeof process === 'object' && process.platform)) ? 'win32' : 'unix'

const {
    join,
    relative,
    isRelative,
    isPathInside,
    pathDepth,
    basename,
    extname,
    dirname,
    normalize,
    toWinPath,
    toUnixPath,
    splitPath,
    removeTrailingSlashes,
} = new PathFx(platform)

export {
    PathFx,
    join,
    relative,
    isRelative,
    isPathInside,
    pathDepth,
    basename,
    extname,
    dirname,
    normalize,
    toWinPath,
    toUnixPath,
    splitPath,
    removeTrailingSlashes,
}
