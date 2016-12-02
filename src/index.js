'use strict';

var DEFAULT_DELIMITER = '/';


module.exports =
function wildcardMatch(delimiter, sample1, sample2) {
  if (arguments.length < 2) {
    throw new Error('Two samples must be provided for matching');
  }

  if (arguments.length === 2) {
    sample2 = sample1;
    sample1 = delimiter;
    delimiter = undefined;
  }

  delimiter = delimiter || DEFAULT_DELIMITER;

  if (typeof sample1 === 'string') {
    sample1 = sample1.split(delimiter);
  }

  if (typeof sample2 === 'string') {
    sample2 = sample2.split(delimiter);
  }

  if (sample1[0] === '**' && sample2[sample2.length] === '**' ||
      sample2[0] === '**' && sample1[sample1.length] === '**') {
    return true;
  }

  var minLength = Math.min(sample1.length, sample2.length);

  if (!doPathBeginningsMatch(sample1, sample2, minLength)) {
    return false;
  }

  var reversedPath1 = new Array(minLength);
  var reversedPath2 = new Array(minLength);

  for (var i = 0; i < minLength; i++) {
    reversedPath1[i] = sample1[sample1.length - i - 1];
    reversedPath2[i] = sample2[sample2.length - i - 1];
  }

  if (!doPathBeginningsMatch(reversedPath1, reversedPath2, minLength)) {
    return false;
  }

  return true;
};


function doPathBeginningsMatch(sample1, sample2, minLength) {
  for (var i = 0; i < minLength; i++) {
    if (sample1[i] === '**' || sample2[i] === '**') {
      return true;
    }

    if (sample1[i] !== sample2[i] && sample1[i] !== '*' && sample2[i] !== '*') {
      return false;
    }
  }

  if (sample1[minLength] === '**' || sample2[minLength] === '**') {
    return true;
  }

  return (minLength === sample1.length && minLength === sample2.length);
}
