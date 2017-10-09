'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getWithParam = undefined;

var _Helpers = require('../services/Helpers');

var _Globals = require('../constants/Globals');

var getWithParam = exports.getWithParam = function getWithParam(req, res, next, route) {
    var id = req.params.id;

    var routeReplaced = (0, _Helpers.replaceSlashWithDot)(route);

    // this means we have an ID the same as a route (which is not allowed, so this is OK)
    // so we forward it to the next with route included
    if (_Globals.mainRoutes.includes(route)) {
        next(route);
    } else {
        if ((0, _Helpers.checkIfNotNull)(id)) {
            var objValue = _Globals.db.get(routeReplaced + '.data').value();
            if (objValue && Array.isArray(objValue)) {
                objValue.forEach(function (elem, index) {
                    if ((0, _Helpers.checkIfNotNull)(elem.id) && elem.id === id) {
                        res.jsonp((0, _Helpers.wrapInDataKey)(elem));
                    } else if ((0, _Helpers.isLastItem)(index, objValue)) {
                        next();
                    }
                });
            } else {
                next();
            }
        } else {
            (0, _Helpers.NotFoundhandler)();
            next();
        }
    }
};