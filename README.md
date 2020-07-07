# wildcard-match

Compile a glob-like pattern into a regular expression.

```js
import wcm from 'wildcard-match'

const regExp = wcm('wildc?rd-mat*')
regExp.test('wildcard-match') //=> true
```

- `?` matches a single arbitrary character
- `*` matches zero or more arbitrary characters

When a separator such as `/` is provided, the above wildcards will only match non-separator characters, and the following is activated:

- `**` matches any number of segments when used as a whole segment (i.e. `/**/` in the middle, `**/` at the beginning or `/**` at the end of a separated string)

```js
wcm('src/**/*.?s', '/').test('src/lib/component/index.js') //=> true
```

## Install

`npm install wildcard-match`

## Usage

### wildcardMatch(pattern, separator?): RegExp

The default export is a function that takes a string or an array of strings and an optional
separator (or an options object with a _separator_ property). It compiles the pattern into
a RegExp object that can be used to match strings with the pattern.

```js
import wcm from 'wildcard-match'

const regExp = wcm('foo*/b?r', '/')

regExp.test('foo/bar') //=> true
regExp.test('foobar') //=> false
```

```js
const regExp = wcm(['one.*', '*.two'], { separator: '.' })

regExp.test('one.two') //=> true
regExp.test('one.three') //=> true
regExp.test('three.two') //=> true
regExp.test('one') //=> false
regExp.test('two') //=> false
regExp.test('one.two.three') //=> false
regExp.test('three.false') //=> false
```

The returned RegExp has `pattern` and `options` properties set to the original values.

```js
const regExp = wcm('p?tt?rn', '/')

match.pattern //=> 'p?tt?rn'
match.options //=> { separator: '/' }
```

A pattern can have `?` and `*` escaped with a backslash so that they are treated as literal characters and not wildcards.

```js
const regExp = wcm('foo\\*')

regExp.test('foo') //=> false
regExp.test('foobar') //=> false
regExp.test('foo*') //=> true
```

When no separator is given, `**` acts as `*`.

```js
const regExp = wcm('foo/**bar')

regExp.test('foo/bar') //=> true
regExp.test('foo/bazbar') //=> true
regExp.test('foo/baz/qux/bar') //=> true
```

## Examples

```js
import wcm from 'wildcard-match'

// *? matches any non-empty substring
const regExp = wcm('*?.js')

regExp.test('index.js') //=> true
regExp.test('src/index.js') //=> true
regExp.test('.js') //=> false
regExp.test('src') //=> false
```

```js
import wcm from 'wildcard-match'

const regExp = wcm('src/**/index.?s', '/')

regExp.test('src/index.js') //=> true
regExp.test('src/lib/index.ts') //=> true
regExp.test('src/lib/component/test/index.ts') //=> true
regExp.test('src') //=> false
regExp.test('index.js') //=> false
regExp.test('src/index.js/lib') //=> false
```

```js
import wcm from 'wildcard-match'

const regExp = wcm('**.*.example.com', '.')

regExp.test('example.com') //=> false
regExp.test('foo.example.com') //=> true
regExp.test('foo.bar.example.com') //=> true
regExp.test('foo.bar.baz.qux.example.com') //=> true
regExp.test('foo.example.com.bar') //=> false
```

## Related

- [globrex](https://github.com/terkelg/globrex)
- [minimatch](https://github.com/isaacs/minimatch)
- [micromatch](https://github.com/micromatch/micromatch)
- [matcher](https://github.com/sindresorhus/matcher)

## License

[ISC](LICENSE)
