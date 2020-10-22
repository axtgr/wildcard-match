interface WildcardMatchOptions {
  separator?: string | boolean
}

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

function escapeRegExpString(str: string) {
  let result = ''
  for (let i = 0; i < str.length; i++) {
    result += escapeRegExpChar(str[i])
  }
  return result
}

function compile(pattern: string | string[], options: WildcardMatchOptions): string {
  if (Array.isArray(pattern)) {
    let regExpPatterns = pattern.map((p) => `^${compile(p, options)}$`)
    return `(?:${regExpPatterns.join('|')})`
  }

  let separator = options.separator
  let separatorSplitter = ''
  let separatorMatcher = ''
  let wildcard = '.'

  if (separator === true) {
    // In this case forward slashes in patterns match both forward and backslashes in samples
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
  } else {
    wildcard = '.'
  }

  // When a separator is explicitly specified in a pattern, it must match _one or more_
  // separators in a sample, so we use quantifiers. When a pattern doesn't have a trailing
  // separator, a sample can still optionally have them, so we use different quantifiers
  // depending on the index of a segment.
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

interface isMatch {
  /**
   * Tests if a sample string matches the pattern(s)
   *
   * ```js
   * isMatch('foo') //=> true
   * ```
   */
  (sample: string): boolean

  /** The compiled regular expression */
  regexp: RegExp

  /** The original pattern or array of patterns that was used to compile the RegExp */
  pattern: string | string[]

  /** The options that were used to compile the RegExp */
  options: WildcardMatchOptions
}

function isMatch(regexp: RegExp, sample: string) {
  if (typeof sample !== 'string') {
    throw new TypeError(`Sample must be a string, but ${typeof sample} given`)
  }

  return regexp.test(sample)
}

/**
 * Compiles one or more glob patterns into a RegExp and returns an isMatch function.
 * The isMatch function takes a sample string as its only argument and returns true
 * if the string matches the pattern(s).
 *
 * ```js
 * wildcardMatch('src/*.js')('src/index.js') //=> true
 * ```
 *
 * ```js
 * const isMatch = wildcardMatch('*.example.com', '.')
 * isMatch('foo.example.com') //=> true
 * isMatch('foo.bar.com') //=> false
 * ```
 */
function wildcardMatch(
  pattern: string | string[],
  options?: string | boolean | WildcardMatchOptions
) {
  if (typeof pattern !== 'string' && !Array.isArray(pattern)) {
    throw new TypeError(
      `The first argument must be a single pattern string or an array of patterns, but ${typeof pattern} given`
    )
  }

  if (typeof options === 'string' || typeof options === 'boolean') {
    options = { separator: options }
  }

  if (
    arguments.length === 2 &&
    (Array.isArray(options) ||
      (typeof options !== 'object' && typeof options !== 'undefined'))
  ) {
    throw new TypeError(
      `The second argument must be an options object or a string/boolean separator, but ${typeof options} given`
    )
  }

  options = options || { separator: true }

  let regexpPattern = compile(pattern, options)
  let regexp = new RegExp(`^${regexpPattern}$`)

  let fn = isMatch.bind(null, regexp) as isMatch
  fn.options = options
  fn.pattern = pattern
  fn.regexp = regexp
  return fn
}

export default wildcardMatch
