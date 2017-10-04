// modules
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
const isValidPostValue = require('../services/Helpers').isValidPostValue;
const wrapInDataKey = require('../services/Helpers').wrapInDataKey;
const checkIfNotNull = require('../services/Helpers').checkIfNotNull;
const isLastItem = require('../services/Helpers').isLastItem;
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
const addPrefix = (str) => Globals.nestedRoutePrefix + str;
const addPrefixToRoutes = (routes) => {
    routes.forEach((route, i) => routes[i] = addPrefix(route));
    return routes;
};
const removeNestedRoutes = (obj) => {
    let objCopy = Object.assign(obj);
    Object.keys(objCopy).forEach((objKey) => {
        if (isNested(objKey)) {
            delete objCopy[objKey];
        }
    });
    return objCopy;
};
const traverseThroughRoutes = (routes, resource) => {
    if (routes.length === 0) {
        return resource;
    }
    let resourceKeys = Object.keys(resource);
    for (let idx = 0, len = resourceKeys.length; idx < len; idx++) {
        for (let i = 0, length = routes.length; i < length; i++) {
            if (resourceKeys[idx] === Globals.nestedRoutePrefix + routes[i]) {
                // remove the route we just found from the search list
                // and continue our search down the rabbit hole, keeping a reference of our recursive call
                routes.splice(i, 1);
                return traverseThroughRoutes(routes, resource[resourceKeys[idx]]);
            }
        }
    }
};
// data
// TODO check if an unnested route contains a key with the routePrefix throw an error if it does.
// TODO avoid server restart if post/patch/delete request is done
// TODO This means having a fileWatcher (or move it) in app.js.
const json = JSON.parse(fs.readFileSync(process.env.WATCHFILE || 'db.json', 'utf8'));
recursiveThroughRoutes(json);
const router = express.Router();
mainRoutes.map((route) => {
    router[methods.get](`/${route}`, (req, res, next) => {
        let splittedRoutes = route.split('/');
        // param route, splittedRoutes

        // if the top level json includes a nested route but no further nesting
        if (Object.keys(json).includes(addPrefix(splittedRoutes[0]))) {
            splittedRoutes = addPrefixToRoutes(splittedRoutes);
        }
        // this route isn't nested
        if (splittedRoutes.length === 1) {
            let foundNestedItem = false;
            const splittedRoutesKeyed = Object.keys(json[splittedRoutes[0]]);
            splittedRoutesKeyed.map((objKey, index) => {
                if (isNested(objKey)) {
                    const err = new Error(`Invalid JSON, did you nest a nested route with a non nested parent route? i.e myRoute -> route:myRoute2 INSTEAD OF DOING route:myRoute -> route:myRoute2?`);
                    err.status = 500;
                    foundNestedItem = true;
                    next(err);
                } else if (isLastItem(index, Object.keys(splittedRoutesKeyed)) && !foundNestedItem) {
                    res.jsonp(json[splittedRoutes[0]]);
                }
            });
        } else if (splittedRoutes.length > 1) {
            // this route is nested!
            console.log(splittedRoutes, json);
            let resource = traverseThroughRoutes(splittedRoutes, json);
            resource = removeNestedRoutes(resource);
            res.jsonp(resource);
        }
    });
    router[methods.post](`/${route}`, (req, res, next) => {
        let splittedRoutes = route.split('/');

        if (isValidPostValue(req.body)) {
            const id = uuidv1();
            let routeReplaced = route.split('/');
            routeReplaced = addPrefixToRoutes(routeReplaced);
            routeReplaced = routeReplaced.join('.');

            let type = splittedRoutes
                .slice()
                .pop();

            // push to db and write
            db.get(`${routeReplaced}.data`)
                .push({
                    type: type,
                    id: id,
                    attributes: req.body.data.attributes,
                })
                .write();
            console.log(db.get(`${routeReplaced}.data`).value());

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
    // router[methods.get](`/${route}/:id`, (req, res, next) => {
    //     const id = req.params.id;
    //     if (checkIfNotNull(id)) {
    //         const objValue = db.get(route).value();
    //         if (objValue.data && Array.isArray(objValue.data)) {
    //             objValue.data.forEach((elem, index) => {
    //                 if (checkIfNotNull(elem.id) && elem.id === id) {
    //                     res.jsonp(wrapInDataKey(elem));
    //                 } else if (isLastItem(index, objValue.data)) {
    //                     next();
    //                 }
    //             });
    //         } else {
    //             next();
    //         }
    //     } else {
    //         NotFoundhandler();
    //         next();
    //     }
    // });
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