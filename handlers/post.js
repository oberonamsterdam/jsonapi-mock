'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.post = undefined;

var _Helpers = require('../services/Helpers');

var _Globals = require('../constants/Globals');

var _v = require('uuid/v1');

var _v2 = _interopRequireDefault(_v);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// required in body:
// type
var post = exports.post = function post(req, res, next, route) {
    if ((0, _Helpers.isValidPostValue)(req.body)) {
        var id = (0, _v2.default)();
        var reference = route.reference;
        var type = req.body.data.type;
        // create data keyword if not exists.

        (0, _Helpers.createDataArrayIfNotExists)(route.reference);

        // push to db and write
        _Globals.db.get(reference + '.data').push({
            type: type,
            id: id,
            attributes: req.body.data.attributes
        }).write();

        var newData = _Globals.db.get(reference + '.data').find({ id: id }).value();
        if (newData) {
            res.jsonp((0, _Helpers.wrapInDataKey)(newData));
        }
    } else {
        var err = new Error('Invalid request body, check your POST params / what you are sending in the request');
        err.status = 400;
        next(err);
    }
};