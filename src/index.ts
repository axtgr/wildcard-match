interface MatchFn {
  (sample: string): boolean
  pattern: string
}

const DEFAULT_SEPARATOR = '/'

let specialCharsRegExp = new RegExp('[-\\^$*+?.()|[\\]{}]', 'g')

function escapeRegExpString(str: string) {
  return str.replace(specialCharsRegExp, '\\$&')
}

function trimRight(str: string, substr: string) {
  if (str.substr(-substr.length) === substr) {
    return str.substr(0, str.length - substr.length)
  }

  return str
}

function wildcardMatch(pattern: string, separator = DEFAULT_SEPARATOR): MatchFn {
  if (pattern === '**') {
    // @ts-expect-error: in this case the sample argument is not needed,
    // but making it optional is undesirable
    let match = (() => true) as MatchFn
    match.pattern = pattern
    return match
  }

  let escPattern = escapeRegExpString(pattern)
  let escSeparator = escapeRegExpString(separator)
  let regexpPattern: string

  if (pattern === '*') {
    regexpPattern = `((?!${escSeparator}).)*`
  } else {
    let segments = escPattern.split(escSeparator)
    regexpPattern = segments.reduce((result, segment, i) => {
      if (segment === '\\*\\*') {
        if (i === 0) {
          return `(.*${escSeparator})?`
        } else if (i === segments.length - 1) {
          return `${trimRight(result, escSeparator)}(${escSeparator}.*)?`
        }
        return `${trimRight(result, escSeparator)}(${escSeparator}.*)?${escSeparator}`
      }

      segment = segment.replace('\\*', `(((?!${escSeparator}).)*|)`)

      if (i < segments.length - 1) {
        return `${result}${segment}${escSeparator}`
      }

      return `${result}${segment}`
    }, '')
  }

  let regexp = new RegExp(`^${regexpPattern}$`)
  let match = ((sample: string) => regexp.test(sample)) as MatchFn
  match.pattern = pattern
  return match
}

// Support both CommonJS and ES6-like modules.
// Could be `wildcardMatch.default = wildcardMatch`, but TypeScript has a bug:
// https://github.com/microsoft/TypeScript/issues/32470
// eslint-disable-next-line dot-notation
wildcardMatch['default'] = wildcardMatch
export = wildcardMatch
