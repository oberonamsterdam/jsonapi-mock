'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.get = undefined;

var _Helpers = require('../services/Helpers');

var get = exports.get = function get(req, res, next, route) {
    var json = (0, _Helpers.removeNestedRoutes)(route.data);
    res.jsonp(json);
};