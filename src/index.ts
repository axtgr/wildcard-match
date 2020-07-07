function escapeRegExpString(str: string) {
  return str.replace(/[-^$+.()|[\]{}]/g, '\\$&')
}

function trimRight(str: string, substr: string) {
  if (str.substr(-substr.length) === substr) {
    return str.substr(0, str.length - substr.length)
  }

  return str
}

function buildPatternWithSeparators(pattern: string, separator: string) {
  let segments = pattern.split(separator)
  return segments.reduce((result, segment, i) => {
    if (segment === '**') {
      if (i === 0) {
        return `(.*${separator})?`
      } else if (i === segments.length - 1) {
        return `${trimRight(result, separator)}(${separator}.*)?`
      }
      return `${trimRight(result, separator)}(${separator}.*)?${separator}`
    }

    // The order of these replacements is important because the latter contains a ?
    segment = segment
      .replace(/(?<!\\)\?/g, `(?!${separator}).`)
      .replace(/(?<!\\)\*/g, `(((?!${separator}).)*|)`)

    if (i < segments.length - 1) {
      return `${result}${segment}${separator}`
    }

    return `${result}${segment}`
  }, '')
}

function buildRegExpPattern(pattern: string, separator?: string) {
  if (pattern === '**') {
    return '^.*$'
  }

  let regExpPattern: string

  if (!separator) {
    regExpPattern = escapeRegExpString(pattern)
      .replace(/(?<!\\)\?/g, '.')
      .replace(/(?<!\\)\*/g, '.*')
  } else if (pattern === '*') {
    regExpPattern = `((?!${escapeRegExpString(separator)}).)*`
  } else {
    regExpPattern = buildPatternWithSeparators(
      escapeRegExpString(pattern),
      escapeRegExpString(separator)
    )
  }

  return `^${regExpPattern}$`
}

function wildcardMatch(pattern: string, separator?: string) {
  let regexpPattern = buildRegExpPattern(pattern, separator)
  let regExp = new RegExp(regexpPattern) as RegExp & {
    pattern?: string
    separator?: string
  }
  regExp.pattern = pattern
  regExp.separator = separator
  return regExp
}

// Support both CommonJS and ES6-like modules.
// Could be `wildcardMatch.default = wildcardMatch`, but TypeScript has a bug:
// https://github.com/microsoft/TypeScript/issues/32470
// eslint-disable-next-line dot-notation
wildcardMatch['default'] = wildcardMatch
export = wildcardMatch
