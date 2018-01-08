import fs from 'fs';
import low from 'lowdb';
import FileSync from 'lowdb/adapters/FileSync';
import { recursiveThroughRoutes } from '../services/Helpers';

// fall back to default conf
if (!process.env.WATCHFILE) {
    const obj = {
        PORT: 3004,
        WATCHFILE: 'db.json',
        NESTEDROUTEPREFIX: 'route:',
        CONTENTTYPE: 'application/vnd.api+json',
        ACCEPT: 'application/vnd.api+json',
    };
    process.env = {
        ...process.env,
        ...obj
    };
}

export const globalContentType = process.env.CONTENTTYPE;
export const globalAccept = process.env.ACCEPT;
export const nestedRoutePrefix = process.env.NESTEDROUTEPREFIX;
export const json = JSON.parse(fs.readFileSync(process.env.WATCHFILE, 'utf8'));
export const port = process.env.PORT;
export const adapter = new FileSync(process.env.WATCHFILE);
export const db = low(adapter);
export const mainRoutes = [];
recursiveThroughRoutes(json, null, []);
