import * as Globals from '../constants/Globals';
import { port, db, mainRoutes } from '../constants/Globals';

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
// be called once on startup
export const recursiveThroughRoutes = (routes, reference, prefixedReference) => {
    const routesKeys = Object.keys(routes);
    routesKeys.map((subRoute) => {
        // if subroute is nested, go nest mode
        if (isNested(subRoute)) {
            const subRouteReplaced = subRoute.replace(Globals.nestedRoutePrefix, '');

            const obj = {
                route: '',
                data: routes[subRoute],
                routeWithPrefix: subRoute,
                routes: prefixedReference,
                isValid: true,
            };

            prefixedReference.push(subRoute);
            prefixedReference.map((trueRoute) => {
                if (trueRoute.indexOf(Globals.nestedRoutePrefix) !== -1) {
                    obj.isValid = false;
                }
            });

            if (reference) {
                obj.route = `${reference}/${subRouteReplaced}`;
            } else {
                obj.route = `${subRouteReplaced}`;
            }
            mainRoutes.push(obj);
            recursiveThroughRoutes(routes[subRoute], obj.route, obj.routes);
        } else if (!reference) {
            // if subroute isn't nested, push it to the routes
            prefixedReference.push(subRoute);
            const obj = {
                data: routes[subRoute],
                route: subRoute,
                routeWithPrefix: subRoute,
                routes: prefixedReference,
                isValid: true,
            };
            mainRoutes.push(obj.route);
        }
    });
};