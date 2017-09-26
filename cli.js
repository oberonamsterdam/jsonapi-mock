#!/usr/bin/env node
const program = require('commander');
const chalk = require('chalk');
const { spawn } = require('child_process');
const fileWatch = require('node-watch');
const fs = require('fs');
const jsonlint = require('jsonlint');
const clear = require('clear');

program
    .version('1.0.3')
    .option('-p --port [port]', 'Change the port from the default 3004')
    .option('-w, --watch [value]', 'Watch a .json file to act as a DB')
    .parse(process.argv);

const port = program.port || 3004;
const watch = program.watch || 'db.json';
const watchDir = process.cwd() + '/' + watch;

// functions
const getJSONData = () => fs.readFileSync(watchDir, { encoding: 'utf-8' });
const errorMessage = (text) => chalk.white.bgRed(text);
const validateJSON = (json) => {
    try {
        jsonlint.parse(json);
        return true;
    } catch (e) {
        clear();
        console.log(`
${errorMessage(e.name)}
        
${e.message}
`);
        return null;
    }
};
const spawnNodeServer = () => {
    clear();
    const env = Object.create(process.env);
    env.PORT = port;
    env.WATCHFILE = watchDir;
    const child = spawn(`jsonapi-node-server`, [], { env: env});
    child.stdout.on('data', data => console.log(String(data)));
    child.stderr.on('data', data => console.log(String(data)));
    child.on('close', code => console.log(String(code)));
};
if (fs.existsSync(watchDir)) {
    // watcher
    fileWatch(watchDir, { recursive: false }, (e, name) => {
        if (e === 'remove') {
            clear();
            console.log(`
        
${errorMessage(`Couldn't read ${watch} because it got removed!`)}

        `);
        }
    });
    // init server
    if (validateJSON(getJSONData())) {
        spawnNodeServer();
    }
} else if (!fs.existsSync(watchDir)) {
    const sampleJson = require('./db.json');
    console.log(`
    
${errorMessage(`db.json file not found!`)}
    
    ${chalk.green.bold(`Generating one with sample data for you. :)`)}
    
    `);
    fs.writeFileSync(watchDir, JSON.parse(sampleJson), (err) => {
        if(err) {
            return console.log(err);
        }
        console.log(`
        
        ${chalk.green.bold(`Generated sample db.json!`)}
        
        `);
        spawnNodeServer();
    })
}