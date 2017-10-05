#! /usr/bin/env node
import express from 'express';

const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const jsonapiSerializer = require('jsonapi-serializer');
const JSONAPIError = jsonapiSerializer.Error;
const http = require('http');
const Globals = require('./constants/Globals');
const NotFoundhandler = require('./services/Helpers').NotFoundhandler;
const onError = require('./services/Helpers').onError;
const app = express();
const router = require('./routes/routes');
app.use(logger('dev'));
app.use(bodyParser.json({ type: Globals.contentType }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use((req, res, next) => {
    res.header('Content-Type', Globals.contentType);
    res.header('Accept', Globals.contentType);
    res.removeHeader('X-Powered-By');
    next();
});

// check header and pass error if not supported.
app.all('*', (req, res, next) => {
    const contentType = req.header('Content-Type');
    const accept = req.header('Accept');
    if (contentType !== Globals.contentType) {
        const err = new Error(`Unsupported media type, your media type is: ${contentType}, it should be ${Globals.contentType}`);
        err.status = 415;
        next(err);
    }
    if (accept !== Globals.accept) {
        const err = new Error(`Unacceptable Accept header.`);
        err.status = 406;
        next(err);
    }
    next();
});
app.use('/', router);
app.use(NotFoundhandler);
// noinspection JSUnusedLocalSymbols because otherwise express doesn't recognise this as an error handler
app.use((err, req, res, next) => {
    // serialize error
    const errors = new JSONAPIError({
        code: err.status || 500,
        source: { 'pointer': `${err.stack}` },
        title: err.code || err.message,
        detail: err.stack,
    });
    res.status(err.status || 500);
    res.jsonp(errors);
});
const port = process.env.PORT || 3004;
app.set('port', port);
http.createServer(app)
    .on('error', onError)
    .on('listening', () => console.log((`API is up and running on port ${port}`)))
    .listen(port);