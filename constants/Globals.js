'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mainRoutes = exports.db = exports.adapter = exports.port = exports.json = exports.nestedRoutePrefix = exports.globalAccept = exports.globalContentType = undefined;

var _FileSync = require('lowdb/adapters/FileSync');

var _FileSync2 = _interopRequireDefault(_FileSync);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _lowdb = require('lowdb');

var _lowdb2 = _interopRequireDefault(_lowdb);

var _Helpers = require('../services/Helpers');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var globalContentType = exports.globalContentType = process.env.CONTENTTYPE;
var globalAccept = exports.globalAccept = process.env.ACCEPT;
var nestedRoutePrefix = exports.nestedRoutePrefix = process.env.NESTEDROUTEPREFIX;
var json = exports.json = JSON.parse(_fs2.default.readFileSync(process.env.WATCHFILE, 'utf8'));
var port = exports.port = process.env.PORT;
var adapter = exports.adapter = new _FileSync2.default(process.env.WATCHFILE);
var db = exports.db = (0, _lowdb2.default)(adapter);
var mainRoutes = exports.mainRoutes = [];
(0, _Helpers.recursiveThroughRoutes)(json, null, []);