"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  same: true
};
Object.defineProperty(exports, "same", {
  enumerable: true,
  get: function get() {
    return _same.default;
  }
});

var _same = _interopRequireDefault(require("./diff/same"));

var _diff = require("./diff/diff");

Object.keys(_diff).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _diff[key];
    }
  });
});

var _patch = require("./diff/patch");

Object.keys(_patch).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _patch[key];
    }
  });
});

var _apply = require("./diff/apply");

Object.keys(_apply).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _apply[key];
    }
  });
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }