import FileSync from 'lowdb/adapters/FileSync';
import fs from 'fs';
import low from 'lowdb';
import { recursiveThroughRoutes } from '../services/Helpers';

export const globalContentType = 'application/vnd.api+json';
export const globalAccept = 'application/vnd.api+json';
export const nestedRoutePrefix = 'route:';
export const json = JSON.parse(fs.readFileSync(process.env.WATCHFILE || 'db.json', 'utf8'));
export const port = process.env.PORT || 3004;
export const adapter = new FileSync(process.env.WATCHFILE || 'db.json');
export const db = low(adapter);
export const mainRoutes = [];
recursiveThroughRoutes(json, null, []);
