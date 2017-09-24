#!/usr/bin/env node
const program = require('commander');
const chalk = require('chalk');
const oberon = require('./oberon');
const exec = require('child-process-promise').exec;

program
    .version('1.0.3')
    .option('-p --port [port]', 'Change the port from the default 3004')
    .option('-w, --watch [value]', 'Watch a .json file to act as a DB')
    .parse(process.argv);

console.log(`

    ${chalk.green(oberon)}
    
    ${chalk.green('==================')}

    ${chalk.bold.cyanBright(`Running the server on ${program.port || 3004} and watching ${program.watch || 'db.json'}`)} 

`);

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