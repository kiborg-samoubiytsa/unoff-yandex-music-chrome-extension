"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.diff = diff;

var _lcs = _interopRequireDefault(require("./lcs"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Computes the differences between the two arrays.
 *
 * @param {array} a the base array
 * @param {array} b the target array
 * @param compareFunc the comparison function used to determine equality (a, b) => boolean
 * @return {object} the difference between the arrays
 */
function diff(a, b) {
  var compareFunc = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : function (ia, ib) {
    return ia === ib;
  };
  var ret = {
    removed: [],
    added: []
  };
  (0, _lcs.default)(a, b, compareFunc, function (type, oldArr, oldStart, oldEnd, newArr, newStart, newEnd) {
    if (type === "add") {
      for (var i = newStart; i < newEnd; ++i) {
        ret.added.push(newArr[i]);
      }
    } else if (type === "remove") {
      for (var _i = oldStart; _i < oldEnd; ++_i) {
        ret.removed.push(oldArr[_i]);
      }
    }
  });
  return ret;
}