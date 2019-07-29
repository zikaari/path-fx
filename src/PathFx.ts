import * as _isRelative from 'is-relative'

const CONSTANTS = {
    ANY_LEADING_SEP_RE: /^[\\\/]+/,
    ANY_TRAILING_SEP_RE: /[\\\/]+$/,
    UNIX_JOIN_CHARACTER: '/',
    UNIX_SEP_MATCH_RE: /[\/]+/g,
    UNIX_SEP_NEGATE_RE: /[^\/]+/g,
    WIN_JOIN_CHARACTER: '\\',
    WIN_SEP_MATCH_RE: /[\/\\]+/g,
    WIN_SEP_NEGATE_RE: /[^\/\\]+/g,
}

export class PathFx {
    private readonly separator: string

    constructor(private readonly platform: 'win32' | 'unix') {
        this.separator = platform === 'win32'
            ? CONSTANTS.WIN_JOIN_CHARACTER
            : CONSTANTS.UNIX_JOIN_CHARACTER
    }

    public join = (...paths: string[]) => {
        const composed = []
        const hasLeadingSep = CONSTANTS.ANY_LEADING_SEP_RE.test(paths[0])
        const hasTrailingSep = CONSTANTS.ANY_TRAILING_SEP_RE.test(paths[paths.length - 1])
        for (let i = 0; i < paths.length; i++) {
            const path = paths[i]
            const parts = this.splitPath(path)
            for (let j = 0; j < parts.length; j++) {
                const part = parts[j]
                if (part === '.') {
                    continue
                } else if (/^[.]{2,}$/.test(part)) {
                    composed.pop()
                } else {
                    composed.push(part)
                }
            }
        }
        if (hasLeadingSep) {
            composed.unshift('')
        }
        if (hasTrailingSep) {
            composed.push('')
        }
        return composed.join(this.separator)
    }

    /**
     * Relative path `to` something `from` something
     * `from` and `to` MUST BE absolute paths
     *
     * @param from Absolute from
     * @param to Absolute to
     */
    public relative = (from: string, to: string) => {
        if (this.isRelative(from) || this.isRelative(to)) {
            throw new Error(`'from' and 'to' both must be absolute paths`)
        }
        const fromFrags = this.splitPath(from)
        const toFrags = this.splitPath(to)
        const hasTrailingSep = CONSTANTS.ANY_TRAILING_SEP_RE.test(to)
        for (let i = 0; i < fromFrags.length; i++) {
            const fromFrag = fromFrags[i]
            if (fromFrag !== toFrags[i]) {
                const remainder = fromFrags.length - i
                return Array(remainder)
                    .fill('..')
                    .concat(toFrags.slice(i))
                    .join(this.separator) + (hasTrailingSep ? this.separator : '')
            }
        }
        return toFrags.slice(fromFrags.length).join(this.separator) + (hasTrailingSep ? this.separator : '')
    }

    public isPathInside = (containingPath: string, path: string): boolean => {
        const pathFrags = this.splitPath(path)
        const contPathFrags = this.splitPath(containingPath)
        return pathFrags.every((fragment, idx) => fragment === contPathFrags[idx])
    }

    public isRelative = (path: string): boolean => {
        return _isRelative(path)
    }

    public pathDepth = (path: string) => {
        const frags = this.splitPath(path)
        return frags ? frags.length : 0
    }

    public basename = (path: string): string => {
        const frags = this.splitPath(path)
        return frags ? frags[frags.length - 1] : ''
    }

    public normalize = (path: string): string => {
        return this.join(path)
    }

    public extname = (path: string): string => {
        const name = this.basename(path)
        const idx = name.lastIndexOf('.')
        return idx < 0 ? '' : name.slice(idx)
    }

    public toWinPath = (path: string) => {
        this.checkPath(path)
        return path.replace(CONSTANTS.UNIX_SEP_MATCH_RE, CONSTANTS.WIN_JOIN_CHARACTER)
    }

    public toUnixPath = (path: string) => {
        this.checkPath(path)
        return path.replace(CONSTANTS.WIN_SEP_MATCH_RE, CONSTANTS.UNIX_JOIN_CHARACTER)
    }

    public dirname = (path: string) => {
        const parts = this.splitPath(path)
        const hasLeadingSep = CONSTANTS.ANY_LEADING_SEP_RE.test(path)
        parts.pop()
        if (parts.length === 0) {
            return hasLeadingSep ? this.separator : '.'
        }
        if (hasLeadingSep) {
            parts.unshift('')
        }
        return parts.join(this.separator)
    }

    public splitPath = (path: string): string[] => {
        this.checkPath(path)
        return path.match(this.platform === 'win32' ? CONSTANTS.WIN_SEP_NEGATE_RE : CONSTANTS.UNIX_SEP_NEGATE_RE) || []
    }

    public removeTrailingSlashes = (path: string) => {
        this.checkPath(path)
        return path.replace(CONSTANTS.ANY_TRAILING_SEP_RE, '')
    }

    private checkPath = (path: string) => {
        if (typeof path !== 'string') {
            throw new TypeError(`Path must be a string. Received ${typeof path}`)
        }
    }
}
