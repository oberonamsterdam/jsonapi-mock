import { checkIfNotNull } from '../services/Helpers';
import { db } from '../constants/Globals';

export const remove = (req, res, next, route) => {
    const id = req.params.id;
    const { reference } = route;
    const checkIfExists = db.get(`${reference}.data`).find({ id: id}).value();
    if (!checkIfExists) {
        return next();
    }
    if (checkIfNotNull(id)) {
        db.get(`${reference}.data`)
            .remove({ id: id })
            .write();
        const removedItemData = db.get(`${reference}.data`).value();
        let foundRemovedItem = false;
        if (Array.isArray(removedItemData)) {
            removedItemData.map((item) => {
                if (item.id === id) {
                    foundRemovedItem = true;
                }
            });
            if (foundRemovedItem) {
                const err = new Error(`Could not remove / edit ${process.env.WATCHFILE || 'db.json'}`);
                err.status = 500;
                return next(err);
            }
            if (removedItemData.length === 0 || !foundRemovedItem) {
                // TODO respond with a meta object, depending on the request.
                return res.status(204).send();
            }
        } else {
            const err = new Error('Internal server error during remove request');
            err.status = 500;
            return next(err);
        }
    } else {
        return next();
    }
};