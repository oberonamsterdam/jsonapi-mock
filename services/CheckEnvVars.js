'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// invoke a new instance of a class and import the instance.
// not super clean but we get to keep ES6 imports for doing this.
var AwesomeFunc = function AwesomeFunc() {
    _classCallCheck(this, AwesomeFunc);

    var obj = {
        PORT: 3004,
        WATCHFILE: 'db.json',
        NESTEDROUTEPREFIX: 'route:',
        CONTENTTYPE: 'application/vnd.api+json',
        ACCEPT: 'application/vnd.api+json'
    };
    var envKeys = Object.keys(process.env);
    if (!process.env.IGNORE_NO_ENV_VARIABLES) {
        Object.keys(obj).map(function (search) {
            if (!envKeys.includes(search)) {
                throw new Error('Invalid process env variables passed to node process, check your process env variables that your passing.');
            }
        });
    } else {
        process.env = Object.assign(process.env, obj);
    }
};

var inst = exports.inst = new AwesomeFunc();