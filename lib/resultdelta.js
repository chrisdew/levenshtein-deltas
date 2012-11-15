// The Result Delta function accepts two similar results set and produces a diff bewteen them.
module.exports = resultDelta

var lev = require('./levenshtein');


function resultDelta(src, tgt) {
  //console.time('resultdelta');
  if (src.length === 0 && tgt.length === 0) {
    return [];
  }
 
  var src_ids = [];
  var src_by_ids = {};
  var src_pos_by_ids = {};
  for (var i in src) {
    src_pos_by_ids[src[i].id] = i;
    src_ids.push(src[i].id);
    src_by_ids[src[i].id] = src[i];
  }
 
  var tgt_ids = [];
  var tgt_by_ids = {};
  var tgt_pos_by_ids = {}
  for (var j in tgt) {
    tgt_pos_by_ids[tgt[j].id] = j;
    tgt_ids.push(tgt[j].id);
    tgt_by_ids[tgt[j].id] = tgt[j];
  }

  // calculate inserts, deletes and substitutions (record replacement, not field replacement)
  deltas = lev.diff(src_ids, tgt_ids);
  //console.log(deltas);

  // now expand those delta_ids by tying in the data from the records
  var inserted_and_replaced_ids = {}
  for (var k in deltas) {
    var delta = deltas[k];
    if (delta.op === "insert" || delta.op === 'replace') {
      inserted_and_replaced_ids[delta.val] = delta.val;
      delta.val = tgt_by_ids[delta.val];
    } else if (delta.op === "delete") {
      //console.log("src_by_ids", src_by_ids, delta.val);
      delta.val = src_by_ids[delta.val];
    } else {
      console.error("unknown op:", delta.op);
    }
  } 

  // now check that all tgt data is identical to the src data, for all elemnets which exists in both
  for (var p in src_by_ids) {
    if (!tgt_by_ids[p]) {
      continue; // we only care about ids which are in both
    }
    // If this id has already been referenced in an 'insert' or 'replace' operation, then the delta
    // already has the latest data and does not need to include an 'update'.
    if (inserted_and_replaced_ids[p]) {
      continue;
    }
    if (JSON.stringify(src_by_ids[p]) !== JSON.stringify(tgt_by_ids[p])) {
      //console.log("found a difference");
      // We use tgt_pos_by_ids because we are adding the 'update' ops after the other deltas.  We could
      // use src_pos_by_ids and prepend these to teh deltas - it really doesn't matter.
      deltas.push({ op: 'update', pos: (parseInt(tgt_pos_by_ids[p], 10)), val: tgt_by_ids[p]}); 
    }
  }

  //console.timeEnd('resultdelta');
  //console.log("deltas", deltas);
  return deltas;
}

