#!/usr/bin/env node
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
/* eslint-disable no-unused-vars */
import express from 'express';
import http from 'http';
import jsonapiSerializer from 'jsonapi-serializer';
import logger from 'morgan';
import { globalAccept, globalContentType, mainRoutes, port } from './constants/Globals';
import router from './routes/routes';
import './services/CheckEnvVars';
import { isValid, NotFoundhandler, onError } from './services/Helpers';

// const declaration
const app = express();
const JSONAPIError = jsonapiSerializer.Error;

// middleware
app.use(logger('dev'));
app.use(bodyParser.json({ type: globalContentType }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Content-Type', globalContentType);
    res.header('Accept', globalContentType);
    res.removeHeader('X-Powered-By');
    next();
});

// check header and pass error if not supported.
// OPTIONS does not pass content-type or accept headers so we make an exception for OPTIONS, and pass all traffic with the OPTIONS method
app.all('*', (req, res, next) => {
    const contentType = req.header('Content-Type') || '';
    const accept = req.header('Accept') || '';
    switch (req.method) {
        case 'OPTIONS':
            next();
            break;
        default:
            if (contentType.indexOf(globalContentType) === -1) {
                const err = new Error(`Check your Content-Type header if it's correct with either the default header value, 'application/vnd.api+json' or what you configured the Content-Type header to be in .jsonapimockrc. 
                Unsupported media type, your media type is: ${contentType}.
                jsonapi-mock is configured to accept the ${globalContentType} as Content-Type header.`);
                err.status = 415;
                next(err);
            } else if (accept.indexOf(globalAccept) === -1) {
                const err = new Error(`Unacceptable Accept header.`);
                err.status = 406;
                next(err);
            } else {
                next();
            }
    }
});
app.all('*', (req, res, next) => isValid(req, res, next, mainRoutes));
app.use('/', router);
app.use(NotFoundhandler);
// noinspection JSUnusedLocalSymbols because otherwise express doesn't recognise this as an error handler eslint-disable-next-line no-unused-vars
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
app.set('port', port);
http.createServer(app)
    .on('error', onError)
    .on('listening', () => console.log((`API is up and running on port ${port}`)))
    .listen(port);