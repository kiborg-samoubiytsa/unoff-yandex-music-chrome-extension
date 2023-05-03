"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = bestSubSequence;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/* eslint-disable no-bitwise */

/**
 * Longest common subsequence
 *
 * @param a the base array
 * @param b the target array
 * @param compareFunc the comparison function used to determine equality (a, b) => boolean
 * @return {number}
 */
function lcs(a, b, compareFunc) {
  var M = a.length,
      N = b.length;
  var MAX = M + N;
  var v = {
    1: 0
  };

  for (var d = 0; d <= MAX; ++d) {
    for (var k = -d; k <= d; k += 2) {
      var x = void 0;

      if (k === -d || k !== d && v[k - 1] + 1 < v[k + 1]) {
        x = v[k + 1];
      } else {
        x = v[k - 1] + 1;
      }

      var y = x - k;

      while (x < M && y < N && compareFunc(a[x], b[y])) {
        x++;
        y++;
      }

      if (x === M && y === N) {
        return d;
      }

      v[k] = x;
    }
  }

  return -1; // never reach
}

var Direct = {
  none: 0,
  horizontal: 1,
  vertical: 1 << 1,
  diagonal: 1 << 2
};
Direct.all = Direct.horizontal | Direct.vertical | Direct.diagonal;
/**
 *
 * @param a
 * @param aStart
 * @param aEnd
 * @param b
 * @param bStart
 * @param bEnd
 * @param d
 * @param startDirect
 * @param endDirect
 * @param compareFunc the comparison function used to determine equality (a, b) => boolean
 * @param elementsChanged
 */

function getSolution(a, aStart, aEnd, b, bStart, bEnd, d, startDirect, endDirect, compareFunc, elementsChanged) {
  var _preview, _preview2;

  if (d === 0) {
    elementsChanged("same", a, aStart, aEnd, b, bStart, bEnd);
    return;
  } else if (d === aEnd - aStart + (bEnd - bStart)) {
    var removeFirst = (startDirect & Direct.horizontal ? 1 : 0) + (endDirect & Direct.vertical ? 1 : 0);
    var addFirst = (startDirect & Direct.vertical ? 1 : 0) + (endDirect & Direct.horizontal ? 1 : 0);

    if (removeFirst >= addFirst) {
      aStart !== aEnd && elementsChanged("remove", a, aStart, aEnd, b, bStart, bStart);
      bStart !== bEnd && elementsChanged("add", a, aEnd, aEnd, b, bStart, bEnd);
    } else {
      bStart !== bEnd && elementsChanged("add", a, aStart, aStart, b, bStart, bEnd);
      aStart !== aEnd && elementsChanged("remove", a, aStart, aEnd, b, bEnd, bEnd);
    }

    return;
  }

  var M = aEnd - aStart,
      N = bEnd - bStart;
  var HALF = Math.floor(N / 2);
  var now = {};

  for (var k = -d - 1; k <= d + 1; ++k) {
    now[k] = {
      d: Infinity,
      segments: 0,
      direct: Direct.none
    };
  }

  var preview = (_preview = {}, _defineProperty(_preview, -d - 1, {
    d: Infinity,
    segments: 0,
    direct: Direct.none
  }), _defineProperty(_preview, d + 1, {
    d: Infinity,
    segments: 0,
    direct: Direct.none
  }), _preview);

  for (var y = 0; y <= HALF; ++y) {
    var _ref = [preview, now];
    now = _ref[0];
    preview = _ref[1];

    var _loop = function _loop(_k) {
      var x = y + _k;

      if (y === 0 && x === 0) {
        now[_k] = {
          d: 0,
          segments: 0,
          direct: startDirect
        };
        return "continue";
      }

      var currentPoints = [{
        direct: Direct.horizontal,
        d: now[_k - 1].d + 1,
        segments: now[_k - 1].segments + (now[_k - 1].direct & Direct.horizontal ? 0 : 1)
      }, {
        direct: Direct.vertical,
        d: preview[_k + 1].d + 1,
        segments: preview[_k + 1].segments + (preview[_k + 1].direct & Direct.vertical ? 0 : 1)
      }];

      if (x > 0 && x <= M && y > 0 && y <= N && compareFunc(a[aStart + x - 1], b[bStart + y - 1])) {
        currentPoints.push({
          direct: Direct.diagonal,
          d: preview[_k].d,
          segments: preview[_k].segments + (preview[_k].direct & Direct.diagonal ? 0 : 1)
        });
      }

      var bestValue = currentPoints.reduce(function (best, info) {
        if (best.d > info.d) {
          return info;
        } else if (best.d === info.d && best.segments > info.segments) {
          return info;
        }

        return best;
      });
      currentPoints.forEach(function (info) {
        if (bestValue.d === info.d && bestValue.segments === info.segments) {
          bestValue.direct |= info.direct;
        }
      });
      now[_k] = bestValue;
    };

    for (var _k = -d; _k <= d; ++_k) {
      var _ret = _loop(_k);

      if (_ret === "continue") continue;
    }
  }

  var now2 = {};

  for (var _k2 = -d - 1; _k2 <= d + 1; ++_k2) {
    now2[_k2] = {
      d: Infinity,
      segments: 0,
      direct: Direct.none
    };
  }

  var preview2 = (_preview2 = {}, _defineProperty(_preview2, -d - 1, {
    d: Infinity,
    segments: 0,
    direct: Direct.none
  }), _defineProperty(_preview2, d + 1, {
    d: Infinity,
    segments: 0,
    direct: Direct.none
  }), _preview2);

  for (var _y = N; _y >= HALF; --_y) {
    var _ref2 = [preview2, now2];
    now2 = _ref2[0];
    preview2 = _ref2[1];

    var _loop2 = function _loop2(_k3) {
      var x = _y + _k3;

      if (_y === N && x === M) {
        now2[_k3] = {
          d: 0,
          segments: 0,
          direct: endDirect
        };
        return "continue";
      }

      var currentPoints = [{
        direct: Direct.horizontal,
        d: now2[_k3 + 1].d + 1,
        segments: now2[_k3 + 1].segments + (now2[_k3 + 1].direct & Direct.horizontal ? 0 : 1)
      }, {
        direct: Direct.vertical,
        d: preview2[_k3 - 1].d + 1,
        segments: preview2[_k3 - 1].segments + (preview2[_k3 - 1].direct & Direct.vertical ? 0 : 1)
      }];

      if (x >= 0 && x < M && _y >= 0 && _y < N && compareFunc(a[aStart + x], b[bStart + _y])) {
        currentPoints.push({
          direct: Direct.diagonal,
          d: preview2[_k3].d,
          segments: preview2[_k3].segments + (preview2[_k3].direct & Direct.diagonal ? 0 : 1)
        });
      }

      var bestValue = currentPoints.reduce(function (best, info) {
        if (best.d > info.d) {
          return info;
        } else if (best.d === info.d && best.segments > info.segments) {
          return info;
        }

        return best;
      });
      currentPoints.forEach(function (info) {
        if (bestValue.d === info.d && bestValue.segments === info.segments) {
          bestValue.direct |= info.direct;
        }
      });
      now2[_k3] = bestValue;
    };

    for (var _k3 = d; _k3 >= -d; --_k3) {
      var _ret2 = _loop2(_k3);

      if (_ret2 === "continue") continue;
    }
  }

  var best = {
    k: -1,
    d: Infinity,
    segments: 0,
    direct: Direct.none
  };

  for (var _k4 = -d; _k4 <= d; ++_k4) {
    var dSum = now[_k4].d + now2[_k4].d;

    if (dSum < best.d) {
      best.k = _k4;
      best.d = dSum;
      best.segments = now[_k4].segments + now2[_k4].segments + (now[_k4].segments & now2[_k4].segments ? 0 : 1);
      best.direct = now2[_k4].direct;
    } else if (dSum === best.d) {
      var segments = now[_k4].segments + now2[_k4].segments + (now[_k4].segments & now2[_k4].segments ? 0 : 1);

      if (segments < best.segments) {
        best.k = _k4;
        best.d = dSum;
        best.segments = segments;
        best.direct = now2[_k4].direct;
      } else if (segments === best.segments && !(best.direct & Direct.diagonal) && now2[_k4].direct & Direct.diagonal) {
        best.k = _k4;
        best.d = dSum;
        best.segments = segments;
        best.direct = now2[_k4].direct;
      }
    }
  }

  if (HALF + best.k === 0 && HALF === 0) {
    HALF++;
    now[best.k].direct = now2[best.k].direct;
    now2[best.k].direct = preview2[best.k].direct;
  }

  getSolution(a, aStart, aStart + HALF + best.k, b, bStart, bStart + HALF, now[best.k].d, startDirect, now2[best.k].direct, compareFunc, elementsChanged);
  getSolution(a, aStart + HALF + best.k, aEnd, b, bStart + HALF, bEnd, now2[best.k].d, now[best.k].direct, endDirect, compareFunc, elementsChanged);
}
/**
 *
 * @param a
 * @param b
 * @param compareFunc the comparison function used to determine equality (a, b) => boolean
 * @param elementsChanged
 */


function bestSubSequence(a, b, compareFunc, elementsChanged) {
  var d = lcs(a, b, compareFunc);
  getSolution(a, 0, a.length, b, 0, b.length, d, Direct.diagonal, Direct.all, compareFunc, elementsChanged);
}