const { exec } = require('child_process');
const fs = require('fs');

const logStream = fs.createWriteStream('build_debug.log', { flags: 'a' });

logStream.write('Starting build...\n');
// Attempt node execution of vite
const cmd = 'node node_modules/vite/bin/vite.js build';

logStream.write('Executing: ' + cmd + '\n');

const child = exec(cmd, { cwd: __dirname });

child.stdout.on('data', (data) => {
    logStream.write('STDOUT: ' + data);
});

child.stderr.on('data', (data) => {
    logStream.write('STDERR: ' + data);
});

child.on('close', (code) => {
    logStream.write('Child process exited with code ' + code + '\n');
    logStream.end();
});

child.on('error', (err) => {
    logStream.write('Failed to start child process: ' + err + '\n');
    logStream.end();
});
