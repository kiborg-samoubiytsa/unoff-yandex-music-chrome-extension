"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getPatch = getPatch;

var _lcs = _interopRequireDefault(require("./lcs"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Computes the patch necessary to turn array a into array b.
 *
 * @param a the base array
 * @param b the target array
 * @param compareFunc the comparison function used to determine equality (a, b) => boolean
 * @return {object} the computed patch
 */
function getPatch(a, b) {
  var compareFunc = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : function (ia, ib) {
    return ia === ib;
  };
  var patch = [];
  var lastAdd = null;
  var lastRemove = null;
  /**
   *
   * @param {string} type "add" | "remove" | "same"
   * @param {array} oldArr the old array
   * @param {number} oldStart the old start
   * @param {number} oldEnd the old end
   * @param {array} newArr the new array
   * @param {number} newStart the new start
   * @param {number} newEnd the new end
   */

  function pushChange(type, oldArr, oldStart, oldEnd, newArr, newStart, newEnd) {
    if (type === "same") {
      if (lastRemove) {
        patch.push(lastRemove);
      }

      if (lastAdd) {
        patch.push(lastAdd);
      }

      lastRemove = null;
      lastAdd = null;
    } else if (type === "remove") {
      if (!lastRemove) {
        lastRemove = {
          type: "remove",
          oldPos: oldStart,
          newPos: newStart,
          items: []
        };
      }

      for (var i = oldStart; i < oldEnd; ++i) {
        lastRemove.items.push(oldArr[i]);
      }

      if (lastAdd) {
        lastAdd.oldPos += oldEnd - oldStart;

        if (lastRemove.oldPos === oldStart) {
          lastRemove.newPos -= oldEnd - oldStart;
        }
      }
    } else if (type === "add") {
      if (!lastAdd) {
        lastAdd = {
          type: "add",
          oldPos: oldStart,
          newPos: newStart,
          items: []
        };
      }

      for (var _i = newStart; _i < newEnd; ++_i) {
        lastAdd.items.push(newArr[_i]);
      }
    }
  }

  (0, _lcs.default)(a, b, compareFunc, pushChange);
  pushChange("same", [], 0, 0, [], 0, 0);
  return patch;
}