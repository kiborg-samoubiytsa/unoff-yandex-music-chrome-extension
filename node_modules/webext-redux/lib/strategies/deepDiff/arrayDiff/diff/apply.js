"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.applyPatch = applyPatch;

/**
 * Patches an array based on a patch description returning the patched array.
 *
 * @param a the array of items to patch
 * @param patch the patch to be applied
 * @return {*[]} the patched array
 */
function applyPatch(a, patch) {
  var segments = [];
  var sameStart = 0;

  for (var i = 0; i < patch.length; ++i) {
    var patchItem = patch[i];
    sameStart !== patchItem.oldPos && segments.push(a.slice(sameStart, patchItem.oldPos));

    if (patchItem.type === "add") {
      segments.push(patchItem.items);
      sameStart = patchItem.oldPos;
    } else if (patchItem.items) {
      sameStart = patchItem.oldPos + patchItem.items.length;
    } else {
      sameStart = patchItem.oldPos + patchItem.length;
    }
  }

  sameStart !== a.length && segments.push(a.slice(sameStart)); // eslint-disable-next-line prefer-reflect

  return [].concat.apply([], segments);
}