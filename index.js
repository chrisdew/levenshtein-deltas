var levenshtein = require('./lib/levenshtein');
var resultdelta = require('./lib/resultdelta');
var client = require('./lib/client');

exports.Lev = levenshtein.Lev;
exports.diff = levenshtein.diff;
exports.resultDelta = resultdelta;
exports.modifyArray = client.modifyArray;
