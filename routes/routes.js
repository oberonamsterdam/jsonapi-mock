// modules
const db = require('../constants/Methods');
const uuidv1 = require('uuid/v1');

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
        if(isNested(subRoute)) {
            const subRouteReplaced = subRoute.replace(Globals.nestedRoutePrefix, '');
            let route = '';
            if(reference) {
                route =  `${reference}/${subRouteReplaced}`;
            } else {
                route =  `${subRouteReplaced}`;
            }
            mainRoutes.push(route);
            recursiveThroughRoutes(routes[subRoute], route);
        } else if(!reference) {
            // if subroute isn't nested, push it to the routes
            mainRoutes.push(`${subRoute}`);
        }
    })
};
// data
const json = JSON.parse(fs.readFileSync(process.env.WATCHFILE || 'db.json', 'utf8'));
recursiveThroughRoutes(json);
const router = express.Router();
mainRoutes.map((route) => {
    router[methods.get](`/${route}`, (req, res, next) => {
        const splittedRoutes = route.split('/');

        // TODO check if an unnested route contains a key with the routePrefix throw an error if it does.
        // TODO avoid server restart if post/patch/delete request is done

        // this route isn't nested
        if(splittedRoutes.length === 1) {

            res.jsonp(json[splittedRoutes[0]]);
        } else if (splittedRoutes.length > 1) {
            // this route is nested!

        }

        res.jsonp(json[splittedRoutes.map((splitRoute) => json[splitRoute])]);
    });
    // router[methods.post](`/${route}`, (req, res, next) => {
    //     if (isValidPostValue(req.body)) {
    //         const id = uuidv1();
    //
    //         // push to db and write
    //         db.get(`${route}.data`)
    //             .push({
    //                 type: route,
    //                 id: id,
    //                 attributes: req.body.data.attributes,
    //             })
    //             .write();
    //
    //         let newData = db.get(`${route}.data`).find({ id: id }).value();
    //         if (newData) {
    //             res.jsonp(wrapInDataKey(newData));
    //         }
    //     } else {
    //         next();
    //     }
    // });
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