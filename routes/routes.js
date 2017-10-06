import express from 'express';
import { mainRoutes } from '../constants/Globals';
import * as methods from '../constants/Methods';
import { get, post, patch, remove, getWithParam } from '../handlers/index';

// data
// TODO check if an unnested route contains a key with the routePrefix throw an error if it does.
// TODO avoid server restart if post/patch/delete request is done
// TODO This means having a fileWatcher (or move it) in app.js.
const router = express.Router();

mainRoutes.map(({route}, i) => {
    console.log(mainRoutes);
    router[methods.get](`/${route}`, (req, res, next) => get(req, res, next, mainRoutes[i]));
    router[methods.post](`/${route}`, (req, res, next) => post(req, res, next, mainRoutes[i]));
    // router[methods.get](`/${route}/:id`, (req, res, next) => getWithParam(req, res, next, mainRoutes[i])); // maybe unify this into one handler?
    router[methods.patch](`/${route}/:id`, (req, res, next) => patch(req, res, next, mainRoutes[i])); // remove :id param, should be in
    router[methods.remove](`/${route}/:id`, (req, res, next) => remove(req, res, next, mainRoutes[i]));
});

export default router;