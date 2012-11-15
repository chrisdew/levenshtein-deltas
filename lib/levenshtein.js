exports.Lev = Lev
exports.diff = diff

function Lev(src, tgt) {
  this.src = src;
  this.tgt = tgt;
}

// ported from http://en.wikipedia.org/wiki/Levenshtein_distance#Computing_Levenshtein_distance
Lev.prototype.distance = function() {
  var s = this.src;
  var t = this.tgt;
  var slen = s.length;
  var tlen = t.length;

  // initialise 2d matrix
  var d = [];
  for (var k = 0; k <= slen; k++) {
    d[k] = [];
  }

  for (var i = 0; i <= slen; i++) {
    d[i][0] = i; // the distance of any first string to an empty second string
  }

  for (var j = 0; j <= tlen; j++) {
    d[0][j] = j; // the distance of any second string to an empty first string
  }

  for (var j = 1; j <= tlen; j++) {
    for (var i = 1; i <= slen; i++) {
      if (s[i-1] === t[j-1]) {
        d[i][j] = d[i-1][j-1];
      } else {
        d[i][j] = Math.min(d[i-1][j] + 1, d[i][j-1] + 1, d[i-1][j-1] + 1);
      }
    }
  }

  return d[slen][tlen];
}

function diff(src, tgt) {
  //console.log(src, tgt);
  //var lev = new Lev(src, tgt);
  //var act = lev.actions();
  //console.log("diff", lev, act);
  //return act;
  return (new Lev(src, tgt)).actions();
}

Lev.prototype.actions = function() {
  //console.log("src", this.src);
  //console.log("tgt", this.tgt);
  var s = this.src;
  var t = this.tgt;
  var slen = s.length;
  var tlen = t.length;

  // special cases
  if (slen === 0) {
    return insertAll(this.tgt);
  }
  if (tlen === 0) {
    return deleteAll(this.src);
  }

  // initialise 2d matrix
  // initialise an action matrix
  var d = [];
  for (var k = 0; k <= slen; k++) {
    d[k] = [];
  }

  for (var i = 0; i <= slen; i++) {
    d[i][0] = i; // the distance of any first string to an empty second string
  }

  for (var j = 0; j <= tlen; j++) {
    d[0][j] = j; // the distance of any second string to an empty first string
  }

  //printArray(d);
  for (var j = 1; j <= tlen; j++) {
    for (var i = 1; i <= slen; i++) {
      //console.log("i:", i, ", j:", j, "s[" + (i - 1) + "]:", s[(i - 1)], ", t[" + (j - 1) + "]:", t[(j - 1)]);
      if (s[i-1] === t[j-1]) { 
        //console.log("nop");
        d[i][j] = d[i-1][j-1]; // no action
      } else {
        var min = Math.min(d[i-1][j] + 1, d[i][j-1] + 1, d[i-1][j-1] + 1);
        //console.log("min:", min);
        d[i][j] = min;
      }
      //printArray(d);
    }
  }

  //printArray(d);
 
  // Now assemble the actions...
  // We do this by tracing back from the bottom right corner, following the lowest valued
  // elements, preferring the upper-left value in case of a tie.
  var i = slen;
  var j = tlen; 
  var deletes = [];
  var inserts = [];
  var replacements = [];

  while (i != 0 || j != 0) {
    //console.log("i:", i, ", j:", j);
 
    var action;
    // find where to go next
    if (i === 0) {
      action = {op: 'insert', pos: (j-1), val: t[j-1]};
      inserts.unshift(action);
      j--;
    } else if (j === 0) {
      action = {op: 'delete', pos: (i-1), val: s[i-1]};
      deletes.push(action);
      i--;
    } else {
      var min = Math.min(d[i-1][j], d[i][j-1], d[i-1][j-1]);
      if (d[i-1][j-1] === min) {
        if (d[i-1][j-1] === d[i][j]) {
          action = {op: 'nop', pos: (j-1), val: t[j-1]};
        } else {
          action = {op: 'replace', pos: (j-1), val: t[j-1]};
          replacements.unshift(action);
        }
        i--;
        j--;
      } else if (d[i][j-1] === min) {
        action = {op: 'insert', pos: (j-1), val: t[j-1]};
        inserts.unshift(action);
        j--;
      } else if (d[i-1][j] === min) {
        action = {op: 'delete', pos: (i-1), val: s[i-1]};
        deletes.push(action);
        i--;
      } else {
        consolewarnlog("impossible condition");
      }
    }
  }
  actions = [];
  for (var i in deletes) { actions.push(deletes[i]); }
  for (var i in inserts) { actions.push(inserts[i]); }
  for (var i in replacements) { actions.push(replacements[i]); }
    
    

  return actions; 
}

function insertAll(src) {
  var actions = [];
  for (var i in src) {
    actions.push({op: 'insert', pos: (parseInt(i, 10)), val: src[i]});
  }
  return actions;
}

function deleteAll(src) {
  var actions = [];
  for (var i in src) {
    actions.push({op: 'delete', pos: 0, val: src[i]});
  }
  return actions;
}

function printArray(a) {
  for (var i = 0; i < a.length; i++) {
    console.log(a[i]);
  }
}



