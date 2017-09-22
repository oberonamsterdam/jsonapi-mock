#!/usr/bin/env node

/**
 * Module dependencies.
 */

const program = require('commander');
const exec = require('child-process-promise').exec;

program
    .version('1.0.3')
    .option('-p --port [port]', 'Change the port from the default 3004')
    .option('-w, --watch [value]', 'Watch a .json file to act as a DB')
    .parse(process.argv);

console.log(program.port, program.watch);

// so dep of this cli should be jsonapi-node-server

exec(`jsonapi-node-server PORT=3004 WATCH='db.json'`)
    .then(function (result) {
        const stdout = result.stdout;
        const stderr = result.stderr;
        console.log('stdout: ', stdout);
        console.log('stderr: ', stderr);
    })
    .catch(function (err) {
        console.error('ERROR: ', err);
    });