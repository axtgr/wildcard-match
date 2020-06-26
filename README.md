# wildcard-match

Check if a string matches a pattern containing `*` and `**` wildcards.

## Install

`npm install wildcard-match`

## Usage

The default export is a function that takes a pattern and an optional separator (`/` by default).
It compiles the pattern and returns a function for matching strings with it.

```js
const wcm = require('wildcard-match')
const match = wcm('src/*/**/index.js') // Precompile the pattern-matching function
match('src/lib/component/test/index.js') // Check if the string matches the pattern
```

Wildcards will only match whole segments (`/*/`) and not arbitrary substrings (`/foo*/`):

- `*` for exactly one segment
- `**` for _any_ number of segments (including zero)

## Examples

```javascript
const wcm = require('wildcard-match')

const match = wcm('src/**/index.js')

match('src/index.js') // true
match('src/lib/index.js') // true
match('src/lib/component/test/index.js') // true
match('src') // false
match('index.js') // false
match('src/index.js/lib') // false
```

```javascript
const wcm = require('wildcard-match')

const match = wcm('**.*.example.com', '.')

match('example.com') // false
match('foo.example.com') // true
match('foo.bar.example.com') // true
match('foo.bar.baz.qux.example.com') // true
match('foo.example.com.bar') // false
```

```javascript
const wcm = require('wildcard-match')

const match = wcm('**') // will match ANY string

match('') // true
match(' ') // true
match('/') // true
match('foo') // true
match('foo/bar') // true
match('foo/bar/baz/qux') // true
```

## License

[ISC](LICENSE)
