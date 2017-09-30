#! /usr/bin/env node
const express = require('express');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const jsonapiSerializer = require('jsonapi-serializer');
const JSONAPIError = jsonapiSerializer.Error;
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('db.json');
const db = low(adapter);
const http = require('http');
const NotFoundhandler = require('./services/Helpers').NotFoundhandler;
const onError = require('./services/Helpers').onError;
const app = express();
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use((req, res, next) => {
    res.header('Content-Type', 'application/vnd.api+json');
    res.header('Accept', 'application/vnd.api+json');
    next();
});
app.use('/', router);
app.use(NotFoundhandler);
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