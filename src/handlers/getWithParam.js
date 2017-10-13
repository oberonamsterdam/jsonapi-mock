import { db } from '../constants/Globals';
import { checkIfNotNull, isLastItem, NotFoundhandler, wrapInDataKey } from '../services/Helpers';

export const getWithParam = (req, res, next, mainRoute) => {
    const id = req.params.id;
    const { reference } = mainRoute;
    let foundVal = false;

    if (checkIfNotNull(id)) {
        const objValue = db.get(`${reference}.data`).value();
        if (objValue && Array.isArray(objValue)) {
            objValue.forEach((elem, index) => {
                if (checkIfNotNull(elem.id) && elem.id === id) {
                    // this gets called
                    foundVal = true;
                    res.jsonp(wrapInDataKey(elem));
                }
                if (isLastItem(index, objValue) && !foundVal) {
                    next();
                }
            });
        } else {
            next();
        }
    } else {
        NotFoundhandler();
    }
};