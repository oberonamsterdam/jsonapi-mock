import { db, mainRoutes } from '../constants/Globals';
import { checkIfNotNull, isLastItem, NotFoundhandler, wrapInDataKey } from '../services/Helpers';

export const getWithParam = (req, res, next, mainRoute) => {
    const id = req.params.id;
    const { reference, route, data } = mainRoute;

    res.jsonp(data);

    // if (mainRoutes.includes(route)) {
    //     next(route);
    // } else if (checkIfNotNull(id)) {
    //     const objValue = db.get(`${reference}.data`).value();
    //     if (objValue && Array.isArray(objValue)) {
    //         objValue.forEach((elem, index) => {
    //             if (checkIfNotNull(elem.id) && elem.id === id) {
    //                 // this gets called
    //                 res.jsonp(wrapInDataKey(elem));
    //             } else if (isLastItem(index, objValue)) {
    //                 next();
    //             }
    //         });
    //     } else {
    //         next();
    //     }
    // } else {
    //     NotFoundhandler();
    // }
};