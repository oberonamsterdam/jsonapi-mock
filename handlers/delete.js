import { checkIfNotNull } from '../services/Helpers';
import { db } from '../constants/Globals';

export const remove = (req, res, next, route) => {
    const id = req.params.id;
    if (checkIfNotNull(id)) {
        db.get(`${route}.data`)
            .remove({ id: id })
            .write();
        // TODO return data here. maybe?
        res.status(204).send();
    } else {
        next();
    }
};