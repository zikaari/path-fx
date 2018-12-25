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
    const hasLeadingSep = /^[\\\/]/.test(paths[0]);
    const hasTrailingSep = /[\\\/]$/.test(paths[paths.length - 1]);
    for (let i = 0; i < paths.length; i++) {
        const path = paths[i];
        checkPath(path);
        const parts = path.match(/[^\/\\]+/g);
        for (let j = 0; j < parts.length; j++) {
            const part = parts[j];
            if (part === '.') {
                continue;
            } else if (/^[.]{2,}$/.test(part)) {
                composed.pop();
            } else {
                composed.push(part);
            }
        }
    }
    return (hasLeadingSep ? pathSeparator : '') + composed.join(pathSeparator) + (hasTrailingSep ? pathSeparator : '');
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
    const parts = path.match(/[^\\\/]+/g) || [];
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

export function removeTrailingSlashes(path: string) {
    if (typeof path === 'string' && path.length > 0) {
        return path.replace(/[\/\\]+$/, '');
    }
}

export function splitPath(path: string): string[] {
    checkPath(path);
    const frags = removeTrailingSlashes(path).split(/[\/\\]+/g);
    if (frags[0] === '') { // empty caused by leading sep
        frags.shift();
    }
    return frags;
}

/**
 * Relative path `to` something `from` something
 * `from` and `to` MUST BE absolute paths
 *
 * @param from Absolute from
 * @param to Absolute to
 */
export function relative(from: string, to: string) {
    if (isRelative(from) || isRelative(to)) {
        throw new Error(`'from' and 'to' both must be absolute paths`);
    }
    const fromFrags = splitPath(from);
    const toFrags = splitPath(to);
    const hasTrailingSep = /[\\\/]$/.test(to);
    for (let i = 0; i < fromFrags.length; i++) {
        const fromFrag = fromFrags[i];
        if (fromFrag !== toFrags[i]) {
            const remainder = fromFrags.length - i;
            return Array(remainder).fill('..').concat(toFrags.slice(i)).join(pathSeparator) + (hasTrailingSep ? pathSeparator : '');
        }
    }
    return toFrags.slice(fromFrags.length).join(pathSeparator) + (hasTrailingSep ? pathSeparator : '');
}
