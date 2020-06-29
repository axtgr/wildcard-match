# wildcard-match

Check if a string matches a pattern containing wildcards.

```js
match('f?o*')('foobar')
```

- `?` matches a single arbitrary character
- `*` matches zero or more arbitrary characters

When a separator such as `/` is provided, the above wildcards will only match non-separator characters, and the following is activated:

- `**` matches any number of segments when used as a whole segment (i.e. `/**/` in the middle, `**/` or `/**` at the beginning/end of a string)

```js
match('src/**/*.?s', '/')('src/lib/component/index.js')
```

## Install

`npm install wildcard-match`

## Usage

### wildcardMatch(pattern, separator?): MatchFn

The default export is a function that takes a pattern and an optional separator.
It compiles the pattern and returns a function for matching strings with it.

```js
import wcm from 'wildcard-match'

const match = wcm('foo*/b?r', '/')
match('foo/bar') // true
match('foobar') // false
```

The returned function has `pattern` and `separator` properties set to the original values.

```js
match.pattern // 'foo*/b?r'
match.separator // '/'
```

A pattern can have `?` and `*` escaped with a backslash so that they are treated as literal characters and not wildcards.

```js
const match = wcm('foo\\*')

match('foo') // false
match('foobar') // false
match('foo*') // true
```

When no separator is given, `**` acts as `*`.

```js
const match = wcm('foo/**bar')

match('foo/bar') // true
match('foo/bazbar') // true
match('foo/baz/qux/bar') // true
```

## Examples

```js
const match = wcm('src/**/index.?s', '/')

match('src/index.js') // true
match('src/lib/index.ts') // true
match('src/lib/component/test/index.ts') // true
match('src') // false
match('index.js') // false
match('src/index.js/lib') // false
```

```js
const match = wcm('**.*.example.com', '.')

match('example.com') // false
match('foo.example.com') // true
match('foo.bar.example.com') // true
match('foo.bar.baz.qux.example.com') // true
match('foo.example.com.bar') // false
```

## License

[ISC](LICENSE)
