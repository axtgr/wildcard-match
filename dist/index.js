"use strict";
const DEFAULT_SEPARATOR = '/';
let specialCharsRegExp = new RegExp('[-\\^$+.()|[\\]{}]', 'g');
function escapeRegExpString(str) {
    return str.replace(specialCharsRegExp, '\\$&');
}
function trimRight(str, substr) {
    if (str.substr(-substr.length) === substr) {
        return str.substr(0, str.length - substr.length);
    }
    return str;
}
function wildcardMatch(pattern, separator = DEFAULT_SEPARATOR) {
    if (pattern === '**') {
        // @ts-expect-error: in this case the sample argument is not needed,
        // but making it optional is undesirable
        let match = (() => true);
        match.pattern = pattern;
        return match;
    }
    let escPattern = escapeRegExpString(pattern);
    let escSeparator = escapeRegExpString(separator);
    let regexpPattern;
    if (pattern === '*') {
        regexpPattern = `((?!${escSeparator}).)*`;
    }
    else {
        let segments = escPattern.split(escSeparator);
        regexpPattern = segments.reduce((result, segment, i) => {
            if (segment === '**') {
                if (i === 0) {
                    return `(.*${escSeparator})?`;
                }
                else if (i === segments.length - 1) {
                    return `${trimRight(result, escSeparator)}(${escSeparator}.*)?`;
                }
                return `${trimRight(result, escSeparator)}(${escSeparator}.*)?${escSeparator}`;
            }
            // The order of these replacements is important because the latter contains a ?
            segment = segment
                .replace(/(?<!\\)\?/g, `(?!${escSeparator}).`)
                .replace(/(?<!\\)\*/g, `(((?!${escSeparator}).)*|)`);
            if (i < segments.length - 1) {
                return `${result}${segment}${escSeparator}`;
            }
            return `${result}${segment}`;
        }, '');
    }
    let regexp = new RegExp(`^${regexpPattern}$`);
    let match = ((sample) => regexp.test(sample));
    match.pattern = pattern;
    return match;
}
// Support both CommonJS and ES6-like modules.
// Could be `wildcardMatch.default = wildcardMatch`, but TypeScript has a bug:
// https://github.com/microsoft/TypeScript/issues/32470
// eslint-disable-next-line dot-notation
wildcardMatch['default'] = wildcardMatch;
module.exports = wildcardMatch;
//# sourceMappingURL=index.js.map