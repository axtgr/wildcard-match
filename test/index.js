'use strict';

var expect = require('chai').expect;
var match = require('../src');


var shouldMatch = [
  ['one', 'one'],
  ['one.', 'one.'],
  ['one', '*'],
  ['one', '**'],
  ['one', 'one.**'],
  ['*', '*'],
  ['one.two', 'one.two'],
  ['one..two', 'one..two'],
  ['one.two', 'one.*'],
  ['one.two', 'one.**'],
  ['one.two.**', 'one.two'],
  ['**.two.three', 'one.two.three'],
  ['one.*', '*.two'],
  ['one.**', '**.two'],
  ['one.two.**', '**.three.four'],
  ['one.two.*', '**.three'],
  ['*.one.two.*', 'three.**.four'],
  ['one.two.three', '**.three'],
  ['one.**', 'one.two.three']
];

var shouldNotMatch = [
  ['one', 'two'],
  ['one.', 'one'],
  ['one.two', '*'],
  ['one.two.**', 'three'],
  ['one.*', '*.two.three'],
  ['one.two.*', '*.three.four'],
  ['one.*', '**.two.three'],
  ['one.two.*', '**.three.four']
];


describe('wildcard-match', function() {
  shouldMatch.forEach(function(paths) {
    it('matches "' + paths[0] + '" and "' + paths[1] + '"', function() {
      var path1 = paths[0].split('.');
      var path2 = paths[1].split('.');
      var result1 = match(path1, path2);
      var result2 = match(path2, path1);

      expect(result1).to.equal(true);
      expect(result2).to.equal(true);
    });
  });

  shouldNotMatch.forEach(function(paths) {
    it('doesn\'t match "' + paths[0] + '" and "' + paths[1] + '"', function() {
      var path1 = paths[0].split('.');
      var path2 = paths[1].split('.');
      var result = match(path1, path2);

      expect(result).to.equal(false);
    });
  });

  it('works with strings', function() {
    var result1 = match('one/two', 'one/two/**');
    var result2 = match('.', 'one.two', 'one.two');
    var result3 = match(' ', 'one **', 'one');
    var result4 = match('_', 'one_two', 'one');

    expect(result1).to.be.true;
    expect(result2).to.be.true;
    expect(result3).to.be.true;
    expect(result4).to.be.false;
  });

  it('works with arrays', function() {
    var result1 = match(['one', 'two'], ['one', 'two']);
    var result2 = match(['one', '**'], ['one']);

    expect(result1).to.be.true;
    expect(result2).to.be.true;
  });

  it('works with mixed args', function() {
    var result1 = match('.', 'one.two', ['one', 'two']);
    var result2 = match(['one', '**'], 'one');

    expect(result1).to.be.true;
    expect(result2).to.be.true;
  });
});
