module.exports = {
    wrapInDataKey: (obj) => ({ data: [obj] }),

    isLastItem: (i, arr) => ((i + 1) === arr.length),

    checkIfNotNull: (item) => (item !== null || item !== undefined),

    isValidPostValue: (body) => {
        // check for our required type and data keys, and attribute
        if (body.data && typeof body.data === 'object') {
            const obj = Object.keys(body.data);
            if (obj.includes('attributes')) {
                return true;
            }
        } else {
            return false;
        }
    },

    onError: (error) => {
        if (error.syscall !== 'listen') {
            throw error;
        }
        const bind = typeof port === 'string'
            ? 'Pipe ' + port
            : 'Port ' + port;
        switch (error.code) {
            case 'EACCES':
                console.error(bind + ' requires elevated privileges');
                process.exit(1);
                break;
            case 'EADDRINUSE':
                console.error(bind + ' is already in use');
                process.exit(1);
                break;
            default:
                throw error;
        }
    },

    NotFoundhandler: (req, res, next) => {
        const err = new Error('Not Found');
        err.status = 404;
        next(err);
    },


};