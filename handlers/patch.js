'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.patch = undefined;

var _Globals = require('../constants/Globals');

var _Helpers = require('../services/Helpers');

var patch = exports.patch = function patch(req, res, next, route) {
    var id = req.params.id;
    var reference = route.reference;

    var checkIfExists = _Globals.db.get(reference + '.data').find({ id: id }).value();
    if (!checkIfExists) {
        return next();
    }
    if (!req.body.data) {
        var err = new Error('Invalid patch body, did you forget a data keyword in the document root?');
        err.status = 400;
        return next(err);
    }
    if ((0, _Helpers.checkIfNotNull)(id)) {
        if ((0, _Helpers.checkIfNotNull)(req.body.data.id) || (0, _Helpers.checkIfNotNull)(req.body.data.type)) {
            delete req.body.data.type;
            delete req.body.data.id;
        }
        _Globals.db.get(reference + '.data').find({ id: id }).assign(req.body.data).write();
        res.jsonp((0, _Helpers.wrapInDataKey)(_Globals.db.get(reference + '.data').find({ id: id }).value()));
    } else {
        next();
    }
};