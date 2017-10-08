import { db } from '../constants/Globals';
import { checkIfNotNull, wrapInDataKey } from '../services/Helpers';

export const patch = (req, res, next, route) => {
    const id = req.params.id;
    const { reference } = route;
    const checkIfExists = db.get(`${reference}.data`).find({ id: id }).value();
    if (!checkIfExists) {
        return next();
    }
    if (!req.body.data) {
        const err = new Error('Invalid patch body, did you forget a data keyword in the document root?');
        err.status = 400;
        return next(err);
    }
    if (checkIfNotNull(id)) {
        if (checkIfNotNull(req.body.data.id) || checkIfNotNull(req.body.data.type)) {
            delete req.body.data.type;
            delete req.body.data.id;
        }
        db.get(`${reference}.data`)
            .find({ id: id })
            .assign(req.body.data)
            .write();
        res.jsonp(
            wrapInDataKey(db.get(`${reference}.data`)
                .find({ id: id })
                .value()));
    } else {
        next();
    }
};