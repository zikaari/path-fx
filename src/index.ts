import { PathFx } from './PathFx'

const platform = /win32/i.test((typeof navigator === 'object' && navigator.platform) || (typeof process === 'object' && process.platform)) ? 'win32' : 'unix'

const auto = new PathFx(platform)
const win32 = new PathFx('win32')
const unix = new PathFx('unix')

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
} = auto

export {
    PathFx,
    win32,
    unix,
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
