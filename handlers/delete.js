'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.remove = undefined;

var _Helpers = require('../services/Helpers');

var _Globals = require('../constants/Globals');

var remove = exports.remove = function remove(req, res, next, route) {
    var id = req.params.id;
    var reference = route.reference;

    var checkIfExists = _Globals.db.get(reference + '.data').find({ id: id }).value();
    if (!checkIfExists) {
        return next();
    }
    if ((0, _Helpers.checkIfNotNull)(id)) {
        _Globals.db.get(reference + '.data').remove({ id: id }).write();
        var removedItemData = _Globals.db.get(reference + '.data').value();
        var foundRemovedItem = false;
        if (Array.isArray(removedItemData)) {
            removedItemData.map(function (item) {
                if (item.id === id) {
                    foundRemovedItem = true;
                }
            });
            if (foundRemovedItem) {
                var err = new Error('Could not remove / edit ' + (process.env.WATCHFILE || 'db.json'));
                err.status = 500;
                return next(err);
            }
            if (removedItemData.length === 0 || !foundRemovedItem) {
                // TODO respond with a meta object, depending on the request.
                return res.status(204).send();
            }
        } else {
            var _err = new Error('Internal server error during remove request');
            _err.status = 500;
            return next(_err);
        }
    } else {
        return next();
    }
};