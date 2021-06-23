import transform from './transform'

interface WildcardMatchOptions {
  /** Separator to be used to split patterns and samples into segments */
  separator?: string | boolean

  /** Flags to pass to the RegExp */
  flags?: string
}

// This overrides the function's signature because for the end user
// the function is always bound to a RegExp
interface isMatch {
  /**
   * Tests if a sample string matches the pattern(s)
   *
   * ```js
   * isMatch('foo') //=> true
   * ```
   */
  (sample: string): boolean

  /** Compiled regular expression */
  regexp: RegExp

  /** Original pattern or array of patterns that was used to compile the RegExp */
  pattern: string | string[]

  /** Options that were used to compile the RegExp */
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
 * The isMatch function takes a sample string as its only argument and returns `true`
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
    !(
      typeof options === 'undefined' ||
      (typeof options === 'object' && options !== null && !Array.isArray(options))
    )
  ) {
    throw new TypeError(
      `The second argument must be an options object or a string/boolean separator, but ${typeof options} given`
    )
  }

  options = options || {}

  if (options.separator === '\\') {
    throw new Error(
      '\\ is not a valid separator because it is used for escaping. Try setting the separator to `true` instead'
    )
  }

  let regexpPattern = transform(pattern, options.separator)
  let regexp = new RegExp(`^${regexpPattern}$`, options.flags)

  let fn = isMatch.bind(null, regexp) as isMatch
  fn.options = options
  fn.pattern = pattern
  fn.regexp = regexp
  return fn
}

export default wildcardMatch
