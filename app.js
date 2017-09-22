#! /usr/bin/env node
const express = require('express');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const jsonapiSerializer = require('jsonapi-serializer');
const JSONAPIError = jsonapiSerializer.Error;
const JSONAPISerializer = jsonapiSerializer.Serializer;
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('db.json');
const db = low(adapter);
const fs = require('fs');
const shortid = require('shortid');
const http = require('http');
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

// routes
const json = JSON.parse(fs.readFileSync('db.json', 'utf8'));
const routes = Object.keys(json);

routes.map((route) => {
    app.get(`/${route}`, (req, res, next) => res.jsonp(json[route]));
    app.post(`/${route}`, (req, res, next) => {
        if (isValidPostValue(req.body)) {
            const id = shortid.generate();

            // push to db and write
            db.get(`${route}.data`)
                .push({
                    type: route,
                    id: id,
                    attributes: req.body.data.attributes,
                })
                .write();

            let newData = db.get(`${route}.data`).find({ id: id }).value();
            if (newData) {
                res.jsonp(wrapInDataKey(newData));
            }
        } else {
            next();
        }
    });
    app.get(`/${route}/:id`, (req, res, next) => {
        const id = req.params.id;
        if (checkIfNotNull(id)) {
            const objValue = db.get(route).value();
            if (objValue.data && Array.isArray(objValue.data)) {
                objValue.data.forEach((elem, index) => {
                    if (checkIfNotNull(elem.id) && elem.id === id) {
                        res.jsonp(wrapInDataKey(elem));
                    } else if (isLastItem(index, objValue.data)) {
                        next();
                    }
                });
            } else {
                next();
            }
        } else {
            NotFoundhandler();
            next();
        }
    });
    app.patch(`/${route}/:id`, (req, res, next) => {
        const id = req.params.id;
        if (checkIfNotNull(id)) {
            if (checkIfNotNull(req.body.data.id) || checkIfNotNull(req.body.data.type)) {
                delete req.body.data.type;
                delete req.body.data.id;
            }
            db.get(`${route}.data`)
                .find({ id: id })
                .assign(req.body.data)
                .write();
            res.jsonp(
                wrapInDataKey(db.get(`${route}.data`)
                    .find({ id: id })
                    .value()));
        } else {
            next();
        }
    });
    app.delete(`/${route}/:id`, (req, res, next) => {
        const id = req.params.id;
        if (checkIfNotNull(id)) {
            db.get(`${route}.data`)
                .remove({ id: id })
                .write();
            res.status(204).send();
        } else {
            next();
        }
    });
});

const NotFoundhandler = (req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
};

/*
*
*   How a POST request should look like (note that relationships and included is currently not supported)
*   TODO actually check if Content-Type header is equal to application/vnd.api+json and throw 415 error if otherwise
*   TODO check if db.json is valid jsonapi.org spec
* */

// POST /photos HTTP/1.1
// Content-Type: application/vnd.api+json
// Accept: application/vnd.api+json
//
// {
//     "data": {
//          "type": "photos",
//          "attributes": {
//          "title": "Ember Hamster",
//             "src": "http://example.com/images/productivity.png"
//     },
//     "relationships": {
//         "photographer": {
//             "data": { "type": "people", "id": "9" }
//         }
//     }
// }
// }

const isValidPostValue = (body) => {
    // check for our required type and data keys, and attribute
    if (body.data && typeof body.data === 'object') {
        const obj = Object.keys(body.data);
        if (obj.includes('attributes')) {
            return true;
        }
    } else {
        return false;
    }
};

const wrapInDataKey = (obj) => ({ data: [obj] });
const isLastItem = (i, arr) => ((i + 1) === arr.length);
const checkIfNotNull = (item) => (item !== null || item !== undefined);

// catch 404 and forward to error handler either by next or directly calling it
app.use(NotFoundhandler);
// error handler
app.use(function (err, req, res, next) {
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

// get port from somewhere??
const port = 3004;
app.set('port', port);
http.createServer(app)
    .on('error', onError)
    .on('listening', () => console.log(`Hi world, I'm running on port: ${port}`))
    .listen(port);

function onError (error) {
    if (error.syscall !== 'listen') {
        throw error;
    }
    const bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}