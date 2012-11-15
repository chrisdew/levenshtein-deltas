// The Result Delta function accepts two similar results set and produces a diff bewteen them.
exports.modifyArray = modifyArray;

function modifyArray(arr, deltas) {
  for (var i in deltas) {
    var delta = deltas[i];
    if (delta.op === 'insert') {
      arr.splice(delta.pos, 0, delta.val);
    } else if (delta.op === 'delete') {
      arr.splice(delta.pos, 1);
    } else if (delta.op === 'replace') {
      arr[delta.pos] = delta.val;
    } else if (delta.op === 'update') {
      arr[delta.pos] = delta.val;
    } else {
      console.warn("uknown op:", delta.op);
    }
  }
  return arr;
}

