/**
 * Escapes a character if it has a special meaning in regular expressions
 * and returns the character as is if it doesn't
 */
function escapeRegExpChar(char: string) {
  if (
    char === '-' ||
    char === '^' ||
    char === '$' ||
    char === '+' ||
    char === '.' ||
    char === '(' ||
    char === ')' ||
    char === '|' ||
    char === '[' ||
    char === ']' ||
    char === '{' ||
    char === '}' ||
    char === '*' ||
    char === '?' ||
    char === '\\'
  ) {
    return `\\${char}`
  } else {
    return char
  }
}

/**
 * Escapes all characters in a given string that have a special meaning in regular expressions
 */
function escapeRegExpString(str: string) {
  let result = ''
  for (let i = 0; i < str.length; i++) {
    result += escapeRegExpChar(str[i])
  }
  return result
}

/**
 * Transforms one or more glob patterns into a RegExp pattern
 */
function transform(
  pattern: string | string[],
  separator: string | boolean = true
): string {
  if (Array.isArray(pattern)) {
    let regExpPatterns = pattern.map((p) => `^${transform(p, separator)}$`)
    return `(?:${regExpPatterns.join('|')})`
  }

  let separatorSplitter = ''
  let separatorMatcher = ''
  let wildcard = '.'

  if (separator === true) {
    // In this case forward slashes in patterns match both forward and backslashes in samples:
    //
    // `foo/bar` will match `foo/bar`
    //           will match `foo\bar`
    //
    separatorSplitter = '/'
    separatorMatcher = '[/\\\\]'
    wildcard = '[^/\\\\]'
  } else if (separator) {
    separatorSplitter = separator
    separatorMatcher = escapeRegExpString(separatorSplitter)

    if (separatorMatcher.length > 1) {
      separatorMatcher = `(?:${separatorMatcher})`
      wildcard = `((?!${separatorMatcher}).)`
    } else {
      wildcard = `[^${separatorMatcher}]`
    }
  }

  // When a separator is explicitly specified in a pattern,
  // it MUST match ONE OR MORE separators in a sample:
  //
  // `foo/bar/` will match  `foo//bar///`
  //            won't match `foo/bar`
  //
  // When a pattern doesn't have a trailing separator,
  // a sample can still optionally have them:
  //
  // `foo/bar` will match `foo/bar//`
  //
  // So we use different quantifiers depending on the index of a segment.
  let requiredSeparator = separator ? `${separatorMatcher}+?` : ''
  let optionalSeparator = separator ? `${separatorMatcher}*?` : ''

  let segments = separator ? pattern.split(separatorSplitter) : [pattern]
  let result = ''

  for (let s = 0; s < segments.length; s++) {
    let segment = segments[s]
    let nextSegment = segments[s + 1]
    let currentSeparator = ''

    if (!segment && s > 0) {
      continue
    }

    if (separator) {
      if (s === segments.length - 1) {
        currentSeparator = optionalSeparator
      } else if (nextSegment !== '**') {
        currentSeparator = requiredSeparator
      } else {
        currentSeparator = ''
      }
    }

    if (separator && segment === '**') {
      if (currentSeparator) {
        result += s === 0 ? '' : currentSeparator
        result += `(?:${wildcard}*?${currentSeparator})*?`
      }
      continue
    }

    for (let c = 0; c < segment.length; c++) {
      let char = segment[c]

      if (char === '\\') {
        if (c < segment.length - 1) {
          result += escapeRegExpChar(segment[c + 1])
          c++
        }
      } else if (char === '?') {
        result += wildcard
      } else if (char === '*') {
        result += `${wildcard}*?`
      } else {
        result += escapeRegExpChar(char)
      }
    }

    result += currentSeparator
  }

  return result
}

export default transform
