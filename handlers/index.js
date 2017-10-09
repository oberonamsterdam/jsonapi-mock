'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _get = require('./get');

Object.keys(_get).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _get[key];
    }
  });
});

var _post = require('./post');

Object.keys(_post).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _post[key];
    }
  });
});

var _patch = require('./patch');

Object.keys(_patch).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _patch[key];
    }
  });
});

var _delete = require('./delete');

Object.keys(_delete).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _delete[key];
    }
  });
});

var _getWithParam = require('./getWithParam');

Object.keys(_getWithParam).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _getWithParam[key];
    }
  });
});