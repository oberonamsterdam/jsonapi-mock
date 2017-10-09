import FileSync from 'lowdb/adapters/FileSync';
import fs from 'fs';
import low from 'lowdb';
import { recursiveThroughRoutes } from '../services/Helpers';

export const globalContentType = process.env.CONTENTTYPE;
export const globalAccept = process.env.ACCEPT;
export const nestedRoutePrefix = process.env.NESTEDROUTEPREFIX;
export const json = JSON.parse(fs.readFileSync(process.env.WATCHFILE, 'utf8'));
export const port = process.env.PORT;
export const adapter = new FileSync(process.env.WATCHFILE);
export const db = low(adapter);
export const mainRoutes = [];
recursiveThroughRoutes(json, null, []);
