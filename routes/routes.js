'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _Globals = require('../constants/Globals');

var _Methods = require('../constants/Methods');

var methods = _interopRequireWildcard(_Methods);

var _index = require('../handlers/index');

var _getWithParam = require('../handlers/getWithParam');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// data
// TODO check if an unnested route contains a key with the routePrefix throw an error if it does.
// TODO avoid server restart if post/patch/delete request is done
// TODO This means having a fileWatcher (or move it) in app.js.
var router = _express2.default.Router();

_Globals.mainRoutes.map(function (_ref, i) {
    var route = _ref.route;

    route && router[methods.get]('/' + route, function (req, res, next) {
        return (0, _index.get)(req, res, next, _Globals.mainRoutes[i]);
    });
    route && router[methods.post]('/' + route, function (req, res, next) {
        return (0, _index.post)(req, res, next, _Globals.mainRoutes[i]);
    });
    route && router[methods.get]('/' + route + '/:id', function (req, res, next) {
        return (0, _getWithParam.getWithParam)(req, res, next, _Globals.mainRoutes[i]);
    }); // maybe unify this into one handler?
    route && router[methods.patch]('/' + route + '/:id', function (req, res, next) {
        return (0, _index.patch)(req, res, next, _Globals.mainRoutes[i]);
    });
    route && router[methods.remove]('/' + route + '/:id', function (req, res, next) {
        return (0, _index.remove)(req, res, next, _Globals.mainRoutes[i]);
    });
});

exports.default = router;