import * as _isRelative from 'is-relative';

const platform = typeof navigator === 'object' ?
    navigator.platform :
    typeof process === 'object' ?
        process.platform :
        '';
let pathSeparator = /win/i.test(platform || '') ? '\\' : '/';

export function setPathSeparator(separator: string) {
    pathSeparator = separator;
}

export function join(...paths: string[]) {
    const composed = [];
    if (!(paths.slice(1).every((path) => { checkPath(path); return path.search(/[\/\\]/) !== 0; }))) {
        throw new TypeError('Only first path fragment can be absolute. Subsequent paths must not begin with "\\" or "/"');
    }
    const leadingSep = paths[0].search(/[\/\\]/) === 0 ? pathSeparator : '';
    paths.forEach((path) => {
        checkPath(path);
        const parts = path.match(/[^\/\\]+/g);
        parts.forEach((part) => {
            if (part === '.') {
                return;
            } else if (/^[.]{2,}$/.test(part)) {
                composed.pop();
            } else {
                composed.push(part);
            }
        });
    });
    return leadingSep + composed.join(pathSeparator);
}

export function basename(path: string): string {
    checkPath(path);
    return (removeTrailingSlashes(path || '').match(/[^\\\/]+$/) || [])[0] || '';
}

export function normalize(path: string): string {
    return join(path);
}

export function extname(path: string): string {
    const name = basename(path);
    const idx = name.lastIndexOf('.');
    return idx < 0 ? '' : name.slice(idx);
}

export function toWinPath(path: string) {
    checkPath(path);
    return path.replace(/[\/\\]+/g, '\\');
}

export function toUnixPath(path: string) {
    checkPath(path);
    return path.replace(/[\/\\]+/g, '/');
}

export function dirname(path: string) {
    checkPath(path);
    const leadingSep = path.search(/[\/\\]/) === 0 ? pathSeparator : '';
    const parts = path.match(/[^\/\\]+/g) || [];
    parts.pop();
    const dir = parts.join(pathSeparator);
    return dir.length === 0 ? '.' : leadingSep + dir;
}

export function isPathInside(containingPath: string, path: string): boolean {
    const pathFrags = splitPath(path);
    const contPathFrags = splitPath(containingPath);
    return pathFrags.every((fragment, idx) => fragment === contPathFrags[idx]);
}

export function isRelative(path: string): boolean {
    return _isRelative(path);
}

export function pathDepth(path: string) {
    return splitPath(path).length;
}

function checkPath(path: string) {
    if (typeof path !== 'string') {
        throw new TypeError(`Path must be a string. Received ${typeof path}`);
    }
}

function removeTrailingSlashes(path: string) {
    if (typeof path === 'string' && path.length > 0) {
        return path.replace(/[\/\\]+$/, '');
    }
}

function splitPath(path: string): string[] {
    checkPath(path);
    return removeTrailingSlashes(path).split(/[\/\\]+/g);
}
