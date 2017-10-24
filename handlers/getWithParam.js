'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getWithParam = undefined;

var _Globals = require('../constants/Globals');

var _Helpers = require('../services/Helpers');

var getWithParam = exports.getWithParam = function getWithParam(req, res, next, mainRoute) {
    var id = req.params.id;
    var reference = mainRoute.reference,
        route = mainRoute.route,
        data = mainRoute.data;


    res.jsonp(data);

    // if (mainRoutes.includes(route)) {
    //     next(route);
    // } else if (checkIfNotNull(id)) {
    //     const objValue = db.get(`${reference}.data`).value();
    //     if (objValue && Array.isArray(objValue)) {
    //         objValue.forEach((elem, index) => {
    //             if (checkIfNotNull(elem.id) && elem.id === id) {
    //                 // this gets called
    //                 res.jsonp(wrapInDataKey(elem));
    //             } else if (isLastItem(index, objValue)) {
    //                 next();
    //             }
    //         });
    //     } else {
    //         next();
    //     }
    // } else {
    //     NotFoundhandler();
    // }
};