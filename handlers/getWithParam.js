import { checkIfNotNull, isLastItem, NotFoundhandler, replaceSlashWithDot, wrapInDataKey } from '../services/Helpers';
import { db } from '../constants/Globals';
import { mainRoutes} from '../constants/Globals';

export const getWithParam = (req, res, next, route) => {
    const id = req.params.id;

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
};