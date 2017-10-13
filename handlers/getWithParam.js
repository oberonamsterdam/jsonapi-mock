'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getWithParam = undefined;

var _Globals = require('../constants/Globals');

var _Helpers = require('../services/Helpers');

var getWithParam = exports.getWithParam = function getWithParam(req, res, next, mainRoute) {
    var id = req.params.id;
    var reference = mainRoute.reference;

    var foundVal = false;

    console.log('got here');

    if ((0, _Helpers.checkIfNotNull)(id)) {
        var objValue = _Globals.db.get(reference + '.data').value();
        if (objValue && Array.isArray(objValue)) {
            objValue.forEach(function (elem, index) {
                if ((0, _Helpers.checkIfNotNull)(elem.id) && elem.id === id) {
                    // this gets called
                    foundVal = true;
                    res.jsonp((0, _Helpers.wrapInDataKey)(elem));
                }
                if ((0, _Helpers.isLastItem)(index, objValue) && !foundVal) {
                    next();
                }
            });
        } else {
            console.log('next and or header sent3');
            next();
        }
    } else {
        console.log('next and or header sent4');
        (0, _Helpers.NotFoundhandler)();
    }
};