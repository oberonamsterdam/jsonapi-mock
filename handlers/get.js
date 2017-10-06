import {
    addPrefix,
    addPrefixToRoutes, checkIfNotNull,
    isLastItem, isNested, removeNestedRoutes, removePrefixFromRoutes,
    traverseThroughRoutes,
} from '../services/Helpers';
import { json } from '../constants/Globals';

export const get = (req, res, next, route) => {
    let splittedRoutes = route.split('/');
    // param route, splittedRoutes

    console.log(splittedRoutes);

    //

    // // TODO simplify this and clean this up.
    //
    // // if the top level json includes a nested route but no further nesting
    // if ((Object.keys(json).includes(addPrefix(splittedRoutes[0])) && !checkIfNotNull(json[addPrefix(splittedRoutes[0])]))) {
    //     splittedRoutes = addPrefixToRoutes(splittedRoutes);
    // }
    // // this route isn't nested
    // if (splittedRoutes.length === 1) {
    //     let foundNestedItem = false;
    //     const splittedRoutesKeyed = Object.keys(json[splittedRoutes[0]]);
    //
    //     splittedRoutesKeyed.map((objKey, index) => {
    //         // check if parent is nested
    //         if (isNested(objKey) && !isNested(splittedRoutes[0])) {
    //             const err = new Error(`Invalid JSON, did you nest a nested route with a non nested parent route? i.e myRoute -> route:myRoute2 INSTEAD OF DOING route:myRoute -> route:myRoute2?`);
    //             err.status = 500;
    //             foundNestedItem = true;
    //             next(err);
    //         } else if (isLastItem(index, Object.keys(splittedRoutesKeyed)) && !foundNestedItem) {
    //             res.jsonp(removeNestedRoutes(json[splittedRoutes[0]]));
    //         }
    //     });
    // } else if (splittedRoutes.length > 1) {
    //     // because splittedRoutes can have nested parents, and traverseThroughRoutes checks for the route without the route prefix
    //     // we strip splittedRoutes from its prefix (if it has any)
    //
    //     splittedRoutes = removePrefixFromRoutes(splittedRoutes);
    //
    //     // this route is nested!
    //     let resource = traverseThroughRoutes(splittedRoutes, json);
    //     resource = removeNestedRoutes(resource);
    //     res.jsonp(resource);
    // }
};
