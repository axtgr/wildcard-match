import wcm from '../src'
import assert from 'assert'

describe('wildcardMatch', function () {
  describe('pattern is a plain string, sample is a plain string', () => {
    describe('match', () => {
      let values: [string, string][] = [
        ['one', 'one'],
        ['two', 'two'],
        ['one/two', 'one/two'],
        ['one/two/three', 'one/two/three'],
        ['one.two', 'one.two'],
        ['one[].*+{}]  ][[..$', 'one[].*+{}]  ][[..$'],
        ['', ''],
        ['one//', 'one//'],
        ['/', '/'],
        [' ', ' '],
        ['/one/', '/one/'],
      ]

      values.forEach(([pattern, sample]) => {
        it(`'${pattern}' and '${sample}'`, () => {
          let actual = wcm(pattern)(sample)
          assert.strictEqual(actual, true)
        })
      })
    })

    describe("don't match", () => {
      let values: [string, string][] = [
        ['one', 'two'],
        ['two', 'one'],
        ['one/two', 'one/three'],
        ['one/two/three', 'one/two/four'],
        ['one', 'one.two'],
        ['one.two', 'one'],
        ['', 'one'],
        ['one', 'one '],
        [' one', 'one'],
        ['one.two', 'one.two.three'],
        ['one', 'one[].*+{}]][[..$'],
        ['one[].*+{}]][[..$', 'one'],
        ['[].*+{}]][[..$', '].*+{'],
        ['', '**'],
        ['', '*'],
        ['/', ''],
        ['/', 'one/'],
        ['/', '/one'],
        ['', ' '],
        ['/', ' '],
        ['/', ' /'],
        ['/', '/ '],
        ['/', ' / '],
        ['one/two', 'one/*'],
        ['one/two', 'one/**'],
        ['one/two/three', 'one/*/three'],
      ]

      values.forEach(([pattern, sample]) => {
        it(`'${pattern}' and '${sample}'`, () => {
          let actual = wcm(pattern)(sample)
          assert.strictEqual(actual, false)
        })
      })
    })
  })

  describe('pattern contains wildcards, sample is a plain string', () => {
    describe('match', () => {
      let values: [string, string][] = [
        ['*', 'one'],
        ['*/*', 'one/two'],
        ['*/*/*', 'one/two/three'],
        ['**', ''],
        ['**', ' '],
        ['**', ' /'],
        ['**', '/'],
        ['**', '///'],
        ['**', 'two'],
        ['**', 'two/three'],
        ['*/**', 'one'],
        ['*/**', 'one/two'],
        ['*/**', 'one/two/*'],
        ['*/**', 'one/two/**'],
        ['*/**', 'one/two/three'],
        ['*/**', '   /three'],
        ['*/**', '   /three///'],
        ['**/*', 'one'],
        ['**/*', 'one/two'],
        ['**/*', 'one/two/three'],
        ['**/*', 'one/*/three'],
        ['**/*', 'one/*/**'],
        ['*/**/*', 'one/two'],
        ['*/**/*', 'one/two/three'],
        ['*/**/*', 'one/two/three/four/five'],
        ['*/**/*', 'one/two/*/four/five'],
        ['*/**/*', 'one/two/*/four/**'],
        ['*/**/*', 'one/ /three'],
        ['*/**/*/**', 'one/two'],
        ['*/**/*/**', 'one/two/three'],
        ['one/*', 'one/two'],
        ['one/*', 'one/*'],
        ['one/*', 'one/**'],
        ['one/*', 'one/***'],
        ['one/*', 'one/ '],
        ['one/**', 'one'],
        ['one/**', 'one/two'],
        ['one/**', 'one/two/three'],
        ['one/**', 'one/ / '],
        ['one/**', 'one/*/ **'],
        ['one/**', 'one/***'],
        ['one/*/**', 'one/two'],
        ['one/*/**', 'one/two/three'],
        ['one/*/**', 'one/two/three/four'],
        ['one/*/**', 'one/ / '],
        ['one/*/**', 'one/*/ **'],
        ['one/*/**', 'one/***'],
        ['one/**/two', 'one/two'],
        ['one/**/two/*', 'one/two/three'],
        ['one/**/three', 'one/two/three'],
        ['one/**/four', 'one/two/three/four'],
        ['one/**/two/*', 'one/two/three'],
        ['one/**/three/*', 'one/two/three/four'],
      ]

      values.forEach(([pattern, sample]) => {
        it(`'${pattern}' and '${sample}'`, () => {
          let actual = wcm(pattern)(sample)
          assert.strictEqual(actual, true)
        })
      })
    })

    describe("don't match", () => {
      let values: [string, string][] = [
        ['*', ''],
        ['*', '/'],
        ['*', '//'],
        ['*', 'one/two'],
        ['*', 'one/'],
        ['*', '/one'],
        ['*/**', ''],
        ['*/**', '/'],
        ['*/**', '//'],
        ['*/**', '/three'],
        ['*/**', '//three'],
        ['*/**/*', 'one'],
        ['*/**/*/**', 'one'],
        ['one/*', ''],
        ['one/*', '/'],
        ['one/*', '//'],
        ['one/*', 'one/two/three'],
        ['one/*', 'one'],
        ['one/*', 'one/'],
        ['one/*', '/one'],
        ['one/*', 'two/three'],
        ['one/**', ''],
        ['one/**', '/'],
        ['one/**', '//'],
        ['one/**', 'two'],
        ['one/**', 'one/'],
        ['one/**', '/one'],
        ['one/*/**', ''],
        ['one/*/**', '/'],
        ['one/*/**', '//'],
        ['one/*/**', 'one'],
        ['*/one', ''],
        ['*/one', '/'],
        ['*/one', '//'],
        ['*/one', 'one/two/three'],
        ['*/one', 'one'],
        ['*/one', 'one/'],
        ['*/one', '/one'],
        ['*/one', 'one/two'],
        ['**/one', ''],
        ['**/one', '/'],
        ['**/one', '//'],
        ['**/one', 'two'],
        ['**/one', 'one/'],
        ['**/one', '/one'],
        ['*/**/one', ''],
        ['*/**/one', '/'],
        ['*/**/one', '//'],
        ['*/**/one', 'one'],
        ['*/**/one', 'one/two'],
        ['*/**/one', 'two/one/two'],
        ['*two', 'onetwo'],
        ['*two', 'one/two'],
        ['**two', 'one/two'],
        ['**two', 'one/two'],
      ]

      values.forEach(([pattern, sample]) => {
        it(`'${pattern}' and '${sample}'`, () => {
          let actual = wcm(pattern)(sample)
          assert.strictEqual(actual, false)
        })
      })
    })
  })
})
