// Copyright (c) 2010 Barricane Technology Ltd., All Rights Reserved.
// Released under the MIT open source licence.

var vows = require('vows')
  , assert = require('assert')
  , lev = require('../lib/levenshtein')
  ;

var suite = vows.describe('levenshtein').addBatch(
  { "maths"
  : { topic
    : (1 + 1)
    , "one plus one"
    : function(topic) { assert.equal(topic, 2); }
    }
  , "lev - no actions"
  : { topic
    : lev.diff([], [])
    , "check actions"
    : function(topic) { assert.deepEqual(topic, []); } // no actions
    }
  , "lev - three deletes"
  : { topic
    : lev.diff(['a', 'b', 'c'], [])
    , "check actions"
    : function(topic) { assert.deepEqual(topic, [{ op: 'delete', pos: 0, val: 'a' },
                                                 { op: 'delete', pos: 0, val: 'b' },
                                                 { op: 'delete', pos: 0, val: 'c' }
                                                ]); } 
    }
  , "lev - three inserts"
  : { topic
    : lev.diff([], ['a', 'b', 'c'])
    , "check actions"
    : function(topic) { assert.deepEqual(topic, [{ op: 'insert', pos: 0, val: 'a' },
                                                 { op: 'insert', pos: 1, val: 'b' },
                                                 { op: 'insert', pos: 2, val: 'c' }
                                                ]); } 
    }
  , "lev - complex"
  : { topic
    : lev.diff([0, 1, 2, 3, 42, 43, 44], [1, 2, 3, 4, 42, 100, 44])
    , "check actions"
    : function(topic) { assert.deepEqual(topic, [{ op: 'delete', pos: 0, val: 0 },
                                                 { op: 'insert', pos: 3, val: 4 },
                                                 { op: 'replace', pos: 5, val: 100 }
                                                ]); } 
    }
  , "lev - complex 2"
  : { topic
    : lev.diff([13, 6, 5, 1, 8, 9, 2, 15, 12, 7, 11], [9, 13, 6, 5, 1, 8, 2, 15, 12, 11])
    , "check actions"
    : function(topic) { assert.deepEqual(topic, [{ op: 'delete', pos: 9, val: 7 },
                                                 { op: 'delete', pos: 5, val: 9 },
                                                 { op: 'insert', pos: 0, val: 9 },
                                                ]); } 
    }
  , "lev - complex 3"
  : { topic
    : lev.diff([9, 13, 6, 5, 1, 8, 2, 15, 12, 11], [13, 6, 5, 1, 8, 9, 2, 15, 12, 7, 11])
    , "check actions"
    : function(topic) { assert.deepEqual(topic, [{ op: 'delete', pos: 0, val: 9 },
                                                 { op: 'insert', pos: 5, val: 9 },
                                                 { op: 'insert', pos: 9, val: 7 }
                                                ]); } 
    }
  , "lev - complex 4"
  : { topic
    : lev.diff([9, 13, 6, 5, 1, 8, 2, 15, 12, 11, 16], [13, 6, 5, 1, 8, 9, 2, 15, 12, 7, 11, 17])
    , "check actions"
    : function(topic) { assert.deepEqual(topic, [{ op: 'delete', pos: 0, val: 9 },
                                                 { op: 'insert', pos: 5, val: 9 },
                                                 { op: 'insert', pos: 9, val: 7 },
                                                 { op: 'replace', pos: 11, val: 17 }
                                                ]); } 
    }
/*
*/
  }
)

//TODO test unserialisation

suite.export(module);



