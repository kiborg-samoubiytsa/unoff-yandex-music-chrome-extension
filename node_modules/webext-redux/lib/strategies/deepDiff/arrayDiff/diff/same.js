"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _lcs = _interopRequireDefault(require("./lcs"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 *
 * @param a the base array
 * @param b the target array
 * @param compareFunc the comparison function used to determine equality (a, b) => boolean
 * @return {array}
 */
function _default(a, b) {
  var compareFunc = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : function (ia, ib) {
    return ia === ib;
  };
  var ret = [];
  (0, _lcs.default)(a, b, compareFunc, function (type, oldArr, oldStart, oldEnd) {
    if (type === "same") {
      for (var i = oldStart; i < oldEnd; ++i) {
        ret.push(oldArr[i]);
      }
    }
  });
  return ret;
}