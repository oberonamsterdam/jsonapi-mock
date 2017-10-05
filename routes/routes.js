// modules
import { get } from '../handlers/index';

const uuidv1 = require('uuid/v1');
const FileSync = require('lowdb/adapters/FileSync');
const low = require('lowdb');
const adapter = new FileSync(process.env.WATCHFILE || 'db.json');
const db = low(adapter);
const methods = require('../constants/Methods');
const express = require('express');
const fs = require('fs');
const jsonapiSerializer = require('jsonapi-serializer');
const Globals = require('../constants/Globals');
const NotFoundhandler = require('../services/Helpers').NotFoundhandler;
const JSONAPIError = jsonapiSerializer.Error;
const JSONAPISerializer = jsonapiSerializer.Serializer;

// route specific vars (globals)
let mainRoutes = [];

// funcs
const isNested = (route) => route.indexOf(Globals.nestedRoutePrefix) !== -1;
const recursiveThroughRoutes = (routes, reference) => {
    const routesKeys = Object.keys(routes);
    routesKeys.map((subRoute) => {
        // if subroute is nested, go nest mode
        if (isNested(subRoute)) {
            const subRouteReplaced = subRoute.replace(Globals.nestedRoutePrefix, '');
            let route = '';
            if (reference) {
                route = `${reference}/${subRouteReplaced}`;
            } else {
                route = `${subRouteReplaced}`;
            }
            mainRoutes.push(route);
            recursiveThroughRoutes(routes[subRoute], route);
        } else if (!reference) {
            // if subroute isn't nested, push it to the routes
            mainRoutes.push(`${subRoute}`);
        }
    });
};

// data
// TODO check if an unnested route contains a key with the routePrefix throw an error if it does.
// TODO avoid server restart if post/patch/delete request is done
// TODO This means having a fileWatcher (or move it) in app.js.
const json = JSON.parse(fs.readFileSync(process.env.WATCHFILE || 'db.json', 'utf8'));
recursiveThroughRoutes(json);
const router = express.Router();
mainRoutes.map((route) => {
    router[methods.get](`/${route}`, (req, res, next) => get(req, res, next, route));
    router[methods.post](`/${route}`, (req, res, next) => {
        let splittedRoutes = route.split('/');

        if (isValidPostValue(req.body)) {
            const id = uuidv1();
            const routeReplaced = replaceSlashWithDot(route);
            let type = splittedRoutes
                .slice()
                .pop();

            // create data keyword if not exists.
            createDataArrayIfNotExists(route);

            // push to db and write
            db.get(`${routeReplaced}.data`)
                .push({
                    type: type,
                    id: id,
                    attributes: req.body.data.attributes,
                })
                .write();

            let newData = db.get(`${routeReplaced}.data`).find({ id: id }).value();
            if (newData) {
                res.jsonp(wrapInDataKey(newData));
            }
        } else {
            const err = new Error(`Invalid request body, check your POST params / what you are sending in the request`);
            err.status = 400;
            next(err);
        }
    });
    router[methods.get](`/${route}/:id`, (req, res, next) => {
        const id = req.params.id;

        console.log('IIIIIDDDDDDDD ', req.params.id, route);

        const routeReplaced = replaceSlashWithDot(route);

        // this means we have an ID the same as a route (which is not allowed, so this is OK)
        // so we forward it to the next with route included
        if (mainRoutes.includes(route)) {
            next(route);
        } else {
            if (checkIfNotNull(id)) {
                const objValue = db.get(`${routeReplaced}.data`).value();
                if (objValue && Array.isArray(objValue)) {
                    objValue.forEach((elem, index) => {
                        if (checkIfNotNull(elem.id) && elem.id === id) {
                            res.jsonp(wrapInDataKey(elem));
                        } else if (isLastItem(index, objValue)) {
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
        }
    });
    // router[methods.patch](`/${route}/:id`, (req, res, next) => {
    //     const id = req.params.id;
    //     if (checkIfNotNull(id)) {
    //         if (checkIfNotNull(req.body.data.id) || checkIfNotNull(req.body.data.type)) {
    //             delete req.body.data.type;
    //             delete req.body.data.id;
    //         }
    //         db.get(`${route}.data`)
    //             .find({ id: id })
    //             .assign(req.body.data)
    //             .write();
    //         res.jsonp(
    //             wrapInDataKey(db.get(`${route}.data`)
    //                 .find({ id: id })
    //                 .value()));
    //     } else {
    //         next();
    //     }
    // });
    // router[methods.delete](`/${route}/:id`, (req, res, next) => {
    //     const id = req.params.id;
    //     if (checkIfNotNull(id)) {
    //         db.get(`${route}.data`)
    //             .remove({ id: id })
    //             .write();
    //         res.status(204).send();
    //     } else {
    //         next();
    //     }
    // });
});
module.exports = router;