# wildcard-match

A function that matches two glob-like patterns with each other. It has an advantage over other similar libraries in that it allows *both* samples to have wildcards.


## Installation

`npm install --save wildcard-match`


## Usage

```javascript
let match = require('wildcard-match');

console.log(match('one/**', 'one/two/three')); // true
console.log(match('.', ['one', '**', 'four'], 'one.two.three.four')); // true
console.log(match('one.two', 'one.two.*')); // false because * matches exactly one segment
```

Patterns can be either strings or arrays, and can have the following wildcards:

* `*` for exactly one segment
* `**` for any number of segments (including zero)

If at least one of the samples is a string, a delimiter can be provided as the first argument. If the delimiter is not specified, `/` is used.


## License

[MIT](LICENSE)
