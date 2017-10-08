import * as Globals from '../constants/Globals';
import { db, mainRoutes, port } from '../constants/Globals';

export const createDataArrayIfNotExists = (route) => {
    if (db.get(`${route}.data`).value() === undefined || db.get(`${route}.data`).value() === null) {
        db.set(`${route}.data`, [])
            .write();
        return true;
    }
    return false;
};
export const replaceSlashWithDot = (route) => {
    let routeReplaced = route.split('/');
    routeReplaced = addPrefixToRoutes(routeReplaced);
    routeReplaced = routeReplaced.join('.');
    return routeReplaced;
};
export const removePrefix = (str) => str.replace(Globals.nestedRoutePrefix, '');
export const addPrefix = (str) => Globals.nestedRoutePrefix + str;
export const addPrefixToRoutes = (routes) => {
    routes.forEach((route, i) => {
        routes[i] = addPrefix(route);
    });
    return routes;
};
export const removePrefixFromRoutes = (routes) => {
    routes.forEach((route, i) => {
        routes[i] = removePrefix(route);
    });
    return routes;
};
export const isValid = (req, res, next, routes) => {
    if (!Array.isArray(routes)) {
        const err = new Error('Invalid main routes, this should never happen');
        err.status = 500;
        return next(err);
    }
    for (let i = 0; i < routes.length; i++) {
        if (!routes[i].isValid) {
            return res.jsonp('No no route is bad');
        }
    }
    return next();
};
export const removeNestedRoutes = (obj) => {
    const objCopy = Object.assign(obj);
    Object.keys(objCopy).forEach((objKey) => {
        if (isNested(objKey)) {
            delete objCopy[objKey];
        }
    });
    return objCopy;
};
export const traverseThroughRoutes = (routes, resource) => {
    if (routes.length === 0) {
        return resource;
    }
    const resourceKeys = Object.keys(resource);
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
export const wrapInDataKey = (obj) => ({ data: [obj] });
export const isLastItem = (i, arr) => ((i + 1) === arr.length);
export const checkIfNotNull = (item) => (item !== null || item !== undefined);
export const isValidPostValue = (body) => {
    // check for our required type and data keys, and attribute
    // TODO improve checking and maybe relax it a bit
    if (body.data && typeof body.data === 'object') {
        const obj = Object.keys(body.data);
        if (obj.includes('attributes')) {
            return true;
        }
    } else {
        return false;
    }
};
export const onError = (error) => {
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
};
export const NotFoundhandler = (req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
};

export const isNested = (route) => route.indexOf(Globals.nestedRoutePrefix) !== -1;

// this is NOT a pure function and it changes a global variable, it should only
// be called ONCE, on startup
export const recursiveThroughRoutes = (routes, reference) => {
    const routesKeys = Object.keys(routes);
    routesKeys.map((subRoute) => {
        // if subroute is nested, go nest mode
        if (isNested(subRoute)) {
            let ref = '';
            const subRouteReplaced = removePrefix(subRoute);
            const obj = {
                route: '',
                data: routes[subRoute],
                routeWithPrefix: subRoute,
                reference: '',
                isValid: true,
            };
            if (reference) {
                let refCopy = reference.split('.').slice();
                refCopy.forEach((refx, idx) => {
                    if (isNested(refx)) {
                        refCopy[idx] = removePrefix(refx);
                    }
                });
                refCopy = refCopy.join('/');
                obj.route = `${refCopy}/${subRouteReplaced}`;
                ref = `${reference}.${subRoute}`;
                obj.reference = ref;
            } else {
                ref = subRoute;
                obj.reference = subRoute;
                obj.route = `${subRouteReplaced}`;
            }
            let isValid = true;
            const referenceCopy = obj.reference.slice();

            // if yes, that means its nested
            if (obj.reference.indexOf(Globals.nestedRoutePrefix) !== -1) {
                // so check all routes if they're nested..
                // and if one of them isn't, isValid -> false
                referenceCopy.split('.').map((ref) => {
                    if (ref.indexOf(Globals.nestedRoutePrefix) === -1) {
                        isValid = false;
                    }
                });
            } else {
                // else, it means it isn't nested
                // check all routes and if they contain a nested route, isValid -> false
                referenceCopy.split('.').map((ref) => {
                    if (ref.indexOf(Globals.nestedRoutePrefix !== -1)) {
                        isValid = false;
                    }
                });
            }
            obj.isValid = isValid;
            mainRoutes.push(obj);
            recursiveThroughRoutes(routes[subRoute], ref);
        } else if (!reference) {
            // if subroute isn't nested, push it to the routes
            const obj = {
                data: routes[subRoute],
                route: subRoute,
                routeWithPrefix: subRoute,
                reference: subRoute,
                isValid: true,
            };
            mainRoutes.push(obj);
        }
    });
};