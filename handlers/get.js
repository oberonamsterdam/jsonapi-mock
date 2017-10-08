import {
    removeNestedRoutes,
} from '../services/Helpers';

export const get = (req, res, next, route) => {
    const json = removeNestedRoutes(route.data);
    res.jsonp(json);
};
