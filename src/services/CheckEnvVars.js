// invoke a new instance of a class and import the instance.
// not super clean but we get to keep ES6 imports for doing this.
class AwesomeFunc {
    constructor () {
        const obj = {
            PORT: 3004,
            WATCHFILE: 'db.json',
            NESTEDROUTEPREFIX: 'route:',
            CONTENTTYPE: 'application/vnd.api+json',
            ACCEPT: 'application/vnd.api+json',
        };
        const envKeys = Object.keys(process.env);
        if (!process.env.IGNORE_NO_ENV_VARIABLES) {
            Object.keys(obj).map((search) => {
                if (!envKeys.includes(search)) {
                    throw new Error('Invalid process env variables passed to node process, check your process env variables that your passing.');
                }
            });
        } else {
            process.env = Object.assign(process.env, obj);
        }
    }
}
export const inst = new AwesomeFunc();