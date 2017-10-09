#!/usr/bin/env node
'use strict';

require('./services/CheckEnvVars');

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _cookieParser = require('cookie-parser');

var _cookieParser2 = _interopRequireDefault(_cookieParser);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _jsonapiSerializer = require('jsonapi-serializer');

var _jsonapiSerializer2 = _interopRequireDefault(_jsonapiSerializer);

var _morgan = require('morgan');

var _morgan2 = _interopRequireDefault(_morgan);

var _Globals = require('./constants/Globals');

var _routes = require('./routes/routes');

var _routes2 = _interopRequireDefault(_routes);

var _Helpers = require('./services/Helpers');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// const declaration
var app = (0, _express2.default)();
/* eslint-disable no-unused-vars */

var JSONAPIError = _jsonapiSerializer2.default.Error;

// middleware
app.use((0, _morgan2.default)('dev'));
app.use(_bodyParser2.default.json({ type: _Globals.globalContentType }));
app.use(_bodyParser2.default.urlencoded({ extended: true }));
app.use((0, _cookieParser2.default)());

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Content-Type', _Globals.globalContentType);
    res.header('Accept', _Globals.globalContentType);
    res.removeHeader('X-Powered-By');
    next();
});

// check header and pass error if not supported.
app.all('*', function (req, res, next) {
    var contentType = req.header('Content-Type') || '';
    var accept = req.header('Accept') || '';
    if (contentType.indexOf(_Globals.globalContentType) === -1) {
        var err = new Error('Unsupported media type, your media type is: ' + contentType + ', it should be ' + _Globals.globalContentType);
        err.status = 415;
        next(err);
    }
    if (accept.indexOf(_Globals.globalAccept) === -1) {
        var _err = new Error('Unacceptable Accept header.');
        _err.status = 406;
        next(_err);
    }
    next();
});
app.all('*', function (req, res, next) {
    return (0, _Helpers.isValid)(req, res, next, _Globals.mainRoutes);
});
app.use('/', _routes2.default);
app.use(_Helpers.NotFoundhandler);
// noinspection JSUnusedLocalSymbols because otherwise express doesn't recognise this as an error handler eslint-disable-next-line no-unused-vars
app.use(function (err, req, res, next) {
    // serialize error
    var errors = new JSONAPIError({
        code: err.status || 500,
        source: { 'pointer': '' + err.stack },
        title: err.code || err.message,
        detail: err.stack
    });
    res.status(err.status || 500);
    res.jsonp(errors);
});
app.set('port', _Globals.port);
_http2.default.createServer(app).on('error', _Helpers.onError).on('listening', function () {
    return console.log('API is up and running on port ' + _Globals.port);
}).listen(_Globals.port);