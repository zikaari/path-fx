"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let pathSeparator = /win/i.test((navigator.platform)) ? '\\' : '/';
function setPathSeparator(separator) {
    pathSeparator = separator;
}
exports.setPathSeparator = setPathSeparator;
function join(...paths) {
    const composed = [];
    if (!(paths.slice(1).every((path) => path.search(/[\/\\]/) !== 0))) {
        throw new TypeError('Only first path fragment can be absolute. Subsequent paths must not begin with "\\" or "/"');
    }
    const leadingSep = paths[0].search(/[\/\\]/) === 0 ? pathSeparator : '';
    paths.forEach((path) => {
        checkPath(path);
        const parts = path.match(/[^\/\\]+/g);
        parts.forEach((part) => {
            if (part === '.') {
                return;
            }
            else if (/^[.]{2,}$/.test(part)) {
                composed.pop();
            }
            else {
                composed.push(part);
            }
        });
    });
    return leadingSep + composed.join(pathSeparator);
}
exports.join = join;
function basename(path) {
    checkPath(path);
    return (removeTrailingSlashes(path || '').match(/[^\\\/]+$/) || [])[0] || '';
}
exports.basename = basename;
function extname(path) {
    const name = basename(path);
    const idx = name.lastIndexOf('.');
    return idx < 0 ? '' : name.slice(idx);
}
exports.extname = extname;
function toWinPath(path) {
    checkPath(path);
    return path.replace(/[\/\\]+/g, '\\');
}
exports.toWinPath = toWinPath;
function toUnixPath(path) {
    checkPath(path);
    return path.replace(/[\/\\]+/g, '/');
}
exports.toUnixPath = toUnixPath;
function dirname(path) {
    checkPath(path);
    const leadingSep = path.search(/[\/\\]/) === 0 ? pathSeparator : '';
    const parts = path.match(/[^\/\\]+/g) || [];
    parts.pop();
    const dir = parts.join(pathSeparator);
    return dir.length === 0 ? '.' : leadingSep + dir;
}
exports.dirname = dirname;
function checkPath(path) {
    if (typeof path !== 'string') {
        throw new TypeError(`Path must be a string. Received ${typeof path}`);
    }
}
function removeTrailingSlashes(path) {
    if (typeof path === 'string' && path.length > 0) {
        return path.replace(/[\/\\]+$/, '');
    }
}
//# sourceMappingURL=index.js.map