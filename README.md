Levenshtein Deltas
==================

Calculate Levenshtein deltas, not just distances.

These can be used to keep state in sync between distributed systems, in a most efficient manner.

Updating an array of objects from deltas is illustrated in the `lib/client.js` file.


Example Usage
-------------

```
chris@proliant:~$ node 
> var ld = require('levenshtein-deltas');
undefined
> lev = new ld.Lev(['a', 'b', 'c', 'd', 'e'], ['a', 'd', 'e', 'f', 'g', 'h'])
{ src: 
   [ 'a',
     'b',
     'c',
     'd',
     'e' ],
  tgt: 
   [ 'a',
     'd',
     'e',
     'f',
     'g',
     'h' ] }
> lev.distance();
5
> lev.actions();
[ { op: 'insert', pos: 1, val: 'd' },
  { op: 'replace', pos: 2, val: 'e' },
  { op: 'replace', pos: 3, val: 'f' },
  { op: 'replace', pos: 4, val: 'g' },
  { op: 'replace', pos: 5, val: 'h' } ]
> ld.resultDelta([{id: 0, foo: 'zero'},
...                    {id: 1, foo: 'one'},
...                    {id: 2, foo: 'two'},
...                    {id: 3, foo: 'three'},
...                    {id: 42, foo: 'forty-two'},
...                    {id: 43, foo: 'forty-three'},
...                    {id: 44, foo: 'forty-four'},
...                ], [{id: 1, foo: 'one'},
...                    {id: 2, foo: 'two'},
...                    {id: 3, foo: 'crowd'},
...                    {id: 4, foo: 'four'},
...                    {id: 42, foo: 'meaning of life'},
...                    {id: 100, foo: 'one hundred'},
...                    {id: 44, foo: 'forty-four'},
...                ]);
[ { op: 'delete',
    pos: 0,
    val: { id: 0, foo: 'zero' } },
  { op: 'insert',
    pos: 3,
    val: { id: 4, foo: 'four' } },
  { op: 'replace',
    pos: 5,
    val: { id: 100, foo: 'one hundred' } },
  { op: 'update',
    pos: 2,
    val: { id: 3, foo: 'crowd' } },
  { op: 'update',
    pos: 4,
    val: { id: 42, foo: 'meaning of life' } } ]
> 
```
