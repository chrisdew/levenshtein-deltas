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
    : new lev.Lev([], [])
    , "check distance"
    : function(topic) { assert.deepEqual(topic.distance(), 0); } // no actions
    , "check actions"
    : function(topic) { assert.deepEqual(topic.actions(), []); } // no actions
    }
  , "lev - no actions"
  : { topic
    : new lev.Lev([1,2,3], [1,2,3])
    , "check distance"
    : function(topic) { assert.deepEqual(topic.distance(), 0); } // no actions
    , "check actions"
    : function(topic) { assert.deepEqual(topic.actions(), []); } // no actions
    }
  , "lev - append zero"
  : { topic
    : new lev.Lev([], [0])
    , "check distance"
    : function(topic) { assert.deepEqual(topic.distance(), 1); }
    , "check actions"
    : function(topic) { assert.deepEqual(topic.actions(), [{op: "insert", pos: 0, val: 0}]); }
    }
  , "lev - append one"
  : { topic
    : new lev.Lev([0], [0, 1])
    , "check distance"
    : function(topic) { assert.deepEqual(topic.distance(), 1); }
    , "check actions"
    : function(topic) { assert.deepEqual(topic.actions(), [{op: "insert", pos: 1, val: 1}]); }
    }
  , "lev - remove all"
  : { topic
    : new lev.Lev([0, 1], [])
    , "check distance"
    : function(topic) { assert.deepEqual(topic.distance(), 2); }
    , "check actions"
    : function(topic) { assert.deepEqual(topic.actions(), [{op: "delete", pos: 0, val: 0}, {op: "delete", pos: 0, val: 1}]); }
    }
  , "lev - appended"
  : { topic
    : new lev.Lev(['a','b'], ['a','b','c'])
    , "check distance"
    : function(topic) { assert.deepEqual(topic.distance(), 1); }
    , "check actions"
    : function(topic) { assert.deepEqual(topic.actions(), [{op: "insert", pos: 2, val: 'c'}]); } 
    }
  , "lev - insert"
  : { topic
    : new lev.Lev(['a','b'], ['a','c','b'])
    , "check distance"
    : function(topic) { assert.deepEqual(topic.distance(), 1); }
    , "check actions"
    : function(topic) { assert.deepEqual(topic.actions(), [{op: "insert", pos: 1, val: 'c'}]); }
    }
  , "lev - insert 2"
  : { topic
    : new lev.Lev(['a','b'], ['a','c','d', 'b'])
    , "check distance"
    : function(topic) { assert.deepEqual(topic.distance(), 2); }
    , "check actions"
    : function(topic) { assert.deepEqual(topic.actions(), [{op: "insert", pos: 1, val: 'c'}, {op: "insert", pos: 2, val: 'd'}]); }
    }
  , "lev - delete"
  : { topic
    : new lev.Lev(['a','b','c'], ['a','c'])
    , "check distance"
    : function(topic) { assert.deepEqual(topic.distance(), 1); }
    , "check actions"
    : function(topic) { assert.deepEqual(topic.actions(), [{op: "delete", pos: 1, val: 'b'}]); } 
    }
  , "lev - delete 2"
  : { topic
    : new lev.Lev(['a','b','c'], ['b','c'])
    , "check distance"
    : function(topic) { assert.deepEqual(topic.distance(), 1); }
    , "check actions"
    : function(topic) { assert.deepEqual(topic.actions(), [{op: "delete", pos: 0, val: 'a'}]); } 
    }
  , "lev - delete 3"
  : { topic
    : new lev.Lev(['a','b','c'], ['b'])
    , "check distance"
    : function(topic) { assert.deepEqual(topic.distance(), 2); }
    , "check actions"
    : function(topic) { assert.deepEqual(topic.actions(), [{op: "delete", pos: 2, val: 'c'}, {op: "delete", pos: 0, val: 'a'}]); } 
    }
  , "lev - insert 3"
  : { topic
    : new lev.Lev(['a','b'], ['a','c','d','b', 'e'])
    , "check distance"
    : function(topic) { assert.deepEqual(topic.distance(), 3); }
    , "check actions"
    : function(topic) { assert.deepEqual(topic.actions(), [{op: "insert", pos: 1, val: 'c'}, 
                                                           {op: "insert", pos: 2, val: 'd'},
                                                           {op: "insert", pos: 4, val: 'e'}
                                                           ]); }
    }
  , "lev - delete 4"
  : { topic
    : new lev.Lev(['a','c','d','b', 'e'], ['a', 'b'])
    , "check distance"
    : function(topic) { assert.deepEqual(topic.distance(), 3); }
    , "check actions"
    : function(topic) { assert.deepEqual(topic.actions(), [{op: "delete", pos: 4, val: 'e'}, 
                                                           {op: "delete", pos: 2, val: 'd'},
                                                           {op: "delete", pos: 1, val: 'c'}
                                                           ]); }
    }
  , "lev - complex 0"
  : { topic
    : new lev.Lev(['s', 'i', 't', 't', 'i', 'n', 'g'], ['k', 'i', 't', 't', 'e', 'n'])
    , "check distance"
    : function(topic) { assert.deepEqual(topic.distance(), 3); } 
    , "check actions"
    : function(topic) { assert.deepEqual(topic.actions(), [{ op: 'delete', pos: 6, val: 'g' }, { op: 'replace', pos: 0, val: 'k' }, { op: 'replace', pos: 4, val: 'e' }]); } 
    }
  , "lev - complex 1"
  : { topic
    : new lev.Lev(['k', 'i', 't', 't', 'e', 'n'], ['s', 'i', 't', 't', 'i', 'n', 'g'])
    , "check distance"
    : function(topic) { assert.deepEqual(topic.distance(), 3); }
    , "check actions"
    : function(topic) { assert.deepEqual(topic.actions(), [{ op: 'insert', pos: 6, val: 'g' }, { op: 'replace', pos: 0, val: 's' }, { op: 'replace', pos: 4, val: 'i' }]); } 
    }
  , "lev - complex 2"
  : { topic
    : new lev.Lev(['a', 'b', 'c', 'd', 'e'], ['a', 'd', 'e', 'f', 'g', 'h'])
    , "check distance"
    : function(topic) { assert.deepEqual(topic.distance(), 5); }
    , "check actions"
    : function(topic) { assert.deepEqual(topic.actions(), [{ op: 'insert', pos: 1, val: 'd' }, { op: 'replace', pos: 2, val: 'e' }, { op: 'replace', pos: 3, val: 'f' }, { op: 'replace', pos: 4, val: 'g' }, { op: 'replace', pos: 5, val: 'h' }]); }
    }
  , "lev - complex 3"
  : { topic
    : new lev.Lev(['a', 'b', 'c', 'd', 'e'], ['a', 'b', 'd', 'e', 'f', 'g', 'h'])
    , "check distance"
    : function(topic) { assert.deepEqual(topic.distance(), 4); }
    , "check actions"
    : function(topic) { assert.deepEqual(topic.actions(), [ { op: 'delete', pos: 2, val: 'c' }, { op: 'insert', pos: 4, val: 'f' }, { op: 'insert', pos: 5, val: 'g' }, { op: 'insert', pos: 6, val: 'h' } ]); }
    }
  , "lev - complex 4"
  : { topic
    : new lev.Lev([99, 0, 1, 2, 3, 42, 43], [99, 1, 2, 3, 4, 42, 43])
    , "check distance"
    : function(topic) { assert.deepEqual(topic.distance(), 2); }
    , "check actions"
    : function(topic) { assert.deepEqual(topic.actions(), [ { op: 'delete', pos: 1, val: 0 }, { op: 'insert', pos: 4, val: 4 } ]); }
    }
  , "lev - complex 5"
  : { topic
    : new lev.Lev([0, 1, 2, 3, 42, 43], [1, 2, 3, 4, 42, 43])
    , "check distance"
    : function(topic) { assert.deepEqual(topic.distance(), 2); }
    , "check actions"
    : function(topic) { assert.deepEqual(topic.actions(), [ { op: 'delete', pos: 0, val: 0 }, { op: 'insert', pos: 3, val: 4 } ]); }
    }
/*
*/
  }
)

//TODO test unserialisation

suite.export(module);



