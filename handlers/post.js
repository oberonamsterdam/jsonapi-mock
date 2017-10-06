import { createDataArrayIfNotExists, isValidPostValue, replaceSlashWithDot, wrapInDataKey } from '../services/Helpers';
import { db } from '../constants/Globals';
import uuidv1 from 'uuid/v1';

export const post = (req, res, next, route) => {
    const splittedRoutes = route.split('/');

    if (isValidPostValue(req.body)) {
        const id = uuidv1();
        const routeReplaced = replaceSlashWithDot(route);
        const type = splittedRoutes
            .slice()
            .pop();

        // create data keyword if not exists.
        createDataArrayIfNotExists(route);

        // push to db and write
        db.get(`${routeReplaced}.data`)
            .push({
                type: type,
                id: id,
                attributes: req.body.data.attributes,
            })
            .write();

        const newData = db.get(`${routeReplaced}.data`).find({ id: id }).value();
        if (newData) {
            res.jsonp(wrapInDataKey(newData));
        }
    } else {
        const err = new Error(`Invalid request body, check your POST params / what you are sending in the request`);
        err.status = 400;
        next(err);
    }
};