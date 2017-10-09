'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.recursiveThroughRoutes = exports.isNested = exports.NotFoundhandler = exports.onError = exports.isValidPostValue = exports.checkIfNotNull = exports.isLastItem = exports.wrapInDataKey = exports.traverseThroughRoutes = exports.removeNestedRoutes = exports.isValid = exports.removePrefixFromRoutes = exports.addPrefixToRoutes = exports.addPrefix = exports.removePrefix = exports.replaceSlashWithDot = exports.createDataArrayIfNotExists = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _Globals = require('../constants/Globals');

var Globals = _interopRequireWildcard(_Globals);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var createDataArrayIfNotExists = exports.createDataArrayIfNotExists = function createDataArrayIfNotExists(route) {
    if (_Globals.db.get(route + '.data').value() === undefined || _Globals.db.get(route + '.data').value() === null) {
        _Globals.db.set(route + '.data', []).write();
        return true;
    }
    return false;
};
var replaceSlashWithDot = exports.replaceSlashWithDot = function replaceSlashWithDot(route) {
    var routeReplaced = route.split('/');
    routeReplaced = addPrefixToRoutes(routeReplaced);
    routeReplaced = routeReplaced.join('.');
    return routeReplaced;
};
var removePrefix = exports.removePrefix = function removePrefix(str) {
    return str.replace(Globals.nestedRoutePrefix, '');
};
var addPrefix = exports.addPrefix = function addPrefix(str) {
    return Globals.nestedRoutePrefix + str;
};
var addPrefixToRoutes = exports.addPrefixToRoutes = function addPrefixToRoutes(routes) {
    routes.forEach(function (route, i) {
        routes[i] = addPrefix(route);
    });
    return routes;
};
var removePrefixFromRoutes = exports.removePrefixFromRoutes = function removePrefixFromRoutes(routes) {
    routes.forEach(function (route, i) {
        routes[i] = removePrefix(route);
    });
    return routes;
};
var isValid = exports.isValid = function isValid(req, res, next, routes) {
    if (!Array.isArray(routes)) {
        var err = new Error('Invalid main routes, this should never happen');
        err.status = 500;
        return next(err);
    }
    for (var i = 0; i < routes.length; i++) {
        if (!routes[i].isValid) {
            return res.jsonp('No no route is bad');
        }
    }
    return next();
};
var removeNestedRoutes = exports.removeNestedRoutes = function removeNestedRoutes(obj) {
    var objCopy = Object.assign(obj);
    Object.keys(objCopy).forEach(function (objKey) {
        if (isNested(objKey)) {
            delete objCopy[objKey];
        }
    });
    return objCopy;
};
var traverseThroughRoutes = exports.traverseThroughRoutes = function traverseThroughRoutes(routes, resource) {
    if (routes.length === 0) {
        return resource;
    }
    var resourceKeys = Object.keys(resource);
    for (var idx = 0, len = resourceKeys.length; idx < len; idx++) {
        for (var i = 0, length = routes.length; i < length; i++) {
            if (resourceKeys[idx] === Globals.nestedRoutePrefix + routes[i]) {
                // remove the route we just found from the search list
                // and continue our search down the rabbit hole, keeping a reference of our recursive call
                routes.splice(i, 1);
                return traverseThroughRoutes(routes, resource[resourceKeys[idx]]);
            }
        }
    }
};
var wrapInDataKey = exports.wrapInDataKey = function wrapInDataKey(obj) {
    return { data: [obj] };
};
var isLastItem = exports.isLastItem = function isLastItem(i, arr) {
    return i + 1 === arr.length;
};
var checkIfNotNull = exports.checkIfNotNull = function checkIfNotNull(item) {
    return item !== null || item !== undefined;
};
var isValidPostValue = exports.isValidPostValue = function isValidPostValue(body) {
    // check for our required type and data keys, and attribute
    // TODO improve checking and maybe relax it a bit
    if (body.data && _typeof(body.data) === 'object') {
        var obj = Object.keys(body.data);
        if (obj.includes('attributes')) {
            return true;
        }
    } else {
        return false;
    }
};
var onError = exports.onError = function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }
    var bind = typeof _Globals.port === 'string' ? 'Pipe ' + _Globals.port : 'Port ' + _Globals.port;
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
var NotFoundhandler = exports.NotFoundhandler = function NotFoundhandler(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
};

var isNested = exports.isNested = function isNested(route) {
    return route.indexOf(Globals.nestedRoutePrefix) !== -1;
};

// this is NOT a pure function and it changes a global variable, it should only
// be called ONCE, on startup
var recursiveThroughRoutes = exports.recursiveThroughRoutes = function recursiveThroughRoutes(routes, reference) {
    var routesKeys = Object.keys(routes);
    routesKeys.map(function (subRoute) {
        // if subroute is nested, go nest mode
        if (isNested(subRoute)) {
            var ref = '';
            var subRouteReplaced = removePrefix(subRoute);
            var obj = {
                route: '',
                data: routes[subRoute],
                routeWithPrefix: subRoute,
                reference: '',
                isValid: true
            };
            if (reference) {
                var refCopy = reference.split('.').slice();
                refCopy.forEach(function (refx, idx) {
                    if (isNested(refx)) {
                        refCopy[idx] = removePrefix(refx);
                    }
                });
                refCopy = refCopy.join('/');
                obj.route = refCopy + '/' + subRouteReplaced;
                ref = reference + '.' + subRoute;
                obj.reference = ref;
            } else {
                ref = subRoute;
                obj.reference = subRoute;
                obj.route = '' + subRouteReplaced;
            }
            var _isValid = true;
            var referenceCopy = obj.reference.slice();

            // if yes, that means its nested
            if (obj.reference.indexOf(Globals.nestedRoutePrefix) !== -1) {
                // so check all routes if they're nested..
                // and if one of them isn't, isValid -> false
                referenceCopy.split('.').map(function (ref) {
                    if (ref.indexOf(Globals.nestedRoutePrefix) === -1) {
                        _isValid = false;
                    }
                });
            } else {
                // else, it means it isn't nested
                // check all routes and if they contain a nested route, isValid -> false
                referenceCopy.split('.').map(function (ref) {
                    if (ref.indexOf(Globals.nestedRoutePrefix !== -1)) {
                        _isValid = false;
                    }
                });
            }
            obj.isValid = _isValid;
            _Globals.mainRoutes.push(obj);
            recursiveThroughRoutes(routes[subRoute], ref);
        } else if (!reference) {
            // if subroute isn't nested, push it to the routes
            var _obj = {
                data: routes[subRoute],
                route: subRoute,
                routeWithPrefix: subRoute,
                reference: subRoute,
                isValid: true
            };
            _Globals.mainRoutes.push(_obj);
        }
    });
};