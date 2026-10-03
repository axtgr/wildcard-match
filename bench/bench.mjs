import benchmark from 'benchmark'
import globrex from 'globrex'
import micromatch from 'micromatch'
import { Minimatch, makeRe } from 'minimatch'
import picomatch from 'picomatch'
import { isMatch } from 'matcher'
import wcmatch from '../build/index.js'

const { Suite } = benchmark

function formatNumber(number) {
  return String(number.toFixed(0))
    .split('')
    .reverse()
    .join('')
    .replace(/\d{3}/g, '$&,')
    .split('')
    .reverse()
    .join('')
    .replace(/^,/, '')
    .padStart('100,000,000'.length + 2)
}

function handleStart(event) {
  let longestName = ''
  for (let i = 0; i < event.currentTarget.length; i++) {
    if (event.currentTarget[i].name.length > longestName.length) {
      longestName = event.currentTarget[i].name
    }
  }
  event.currentTarget.longestName = longestName
  console.log(`\n${event.currentTarget.name}`)
}

function handleCycle(event) {
  const name = event.target.name.padEnd(event.currentTarget.longestName.length + 2)
  const hz = formatNumber(event.target.hz)
  console.log(' ', name, hz, 'ops/sec')
}

function pattern() {
  // Make sure the engine doesn't optimize for static strings
  const str = 'src'
  return `${str || 'asd'}/test/**/*.?s`
}

function sample() {
  return 'src/test/foo/bar.js'
}

const OPTIONS = {
  wcmatch: false,
  wcmatchSep: true,
  globrex: { globstar: false, filepath: false, extended: true, strict: false },
  globrexSep: { globstar: true, filepath: true, extended: true, strict: false },
  micromatch: {},
  minimatch: {},
  picomatchSep: {
    nobrace: false,
    nounique: true,
    noquantifiers: true,
    nobracket: false,
    noextglob: false,
    nonegate: false,
    noglobstar: false,
  },
}
const MATCHERS = {
  wcmatch: wcmatch(pattern(), OPTIONS.wcmatch),
  wcmatchSep: wcmatch(pattern(), OPTIONS.wcmatchSep),
  globrex: globrex(pattern(), OPTIONS.globrex).regex,
  globrexSep: globrex(pattern(), OPTIONS.globrexSep).regex,
  micromatch: micromatch.matcher(pattern(), OPTIONS.micromatch),
  minimatch: new Minimatch(pattern(), OPTIONS.minimatch),
  picomatchSep: picomatch(pattern(), OPTIONS.picomatchSep),
}

function compile(fn, options) {
  return function () {
    fn(pattern(), options)
  }
}

function match(fn) {
  if (fn instanceof RegExp) {
    return function () {
      return fn.test(sample())
    }
  } else {
    return function () {
      return fn(sample())
    }
  }
}

new Suite('Compilation')
  .add('globrex', compile(globrex, OPTIONS.globrex))
  .add('globrex separated', compile(globrex, OPTIONS.globrexSep))
  .add('micromatch', compile(micromatch.makeRe, OPTIONS.micromatch))
  .add('minimatch', compile(makeRe, OPTIONS.minimatch))
  .add('picomatch', compile(picomatch))
  .add('picomatch separated', compile(picomatch, OPTIONS.picomatchSep))
  .add('wildcard-match', compile(wcmatch, OPTIONS.wcmatch))
  .add('wildcard-match separated', compile(wcmatch, OPTIONS.wcmatchSep))
  .on('start', handleStart)
  .on('cycle', handleCycle)
  .run()

new Suite('Matching')
  .add(
    'matcher',
    match((input) => isMatch(input, pattern()))
  )
  .add('micromatch', match(MATCHERS.micromatch))
  .add(
    'minimatch',
    match((input) => MATCHERS.minimatch.match(input))
  )
  .add('globrex', match(MATCHERS.globrex))
  .add('globrex separated', match(MATCHERS.globrexSep))
  .add('picomatch separated', match(MATCHERS.picomatchSep))
  .add('wildcard-match', match(MATCHERS.wcmatch))
  .add('wildcard-match separated', match(MATCHERS.wcmatchSep))
  .on('start', handleStart)
  .on('cycle', handleCycle)
  .run()
