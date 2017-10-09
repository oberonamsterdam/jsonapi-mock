import { createDataArrayIfNotExists, isValidPostValue, replaceSlashWithDot, wrapInDataKey } from '../services/Helpers';
import { db } from '../constants/Globals';
import uuidv1 from 'uuid/v1';

// required in body:
// type
export const post = (req, res, next, route) => {
    if (isValidPostValue(req.body)) {
        const id = uuidv1();
        const { reference } = route;
        const { type } = req.body.data;
        // create data keyword if not exists.
        createDataArrayIfNotExists(route.reference);

        // push to db and write
        db.get(`${reference}.data`)
            .push({
                type: type,
                id: id,
                attributes: req.body.data.attributes,
            })
            .write();

        const newData = db.get(`${reference}.data`).find({ id: id }).value();
        if (newData) {
            res.jsonp(wrapInDataKey(newData));
        }
    } else {
        const err = new Error(`Invalid request body, check your POST params / what you are sending in the request`);
        err.status = 400;
        next(err);
    }
};