import { checkIfNotNull, wrapInDataKey } from '../services/Helpers';
import { db } from '../constants/Globals';

export const patch = (req, res, next, route) => {
    const id = req.params.id;
    if (checkIfNotNull(id)) {
        if (checkIfNotNull(req.body.data.id) || checkIfNotNull(req.body.data.type)) {
            delete req.body.data.type;
            delete req.body.data.id;
        }
        db.get(`${route}.data`)
            .find({ id: id })
            .assign(req.body.data)
            .write();
        res.jsonp(
            wrapInDataKey(db.get(`${route}.data`)
                .find({ id: id })
                .value()));
    } else {
        next();
    }
};