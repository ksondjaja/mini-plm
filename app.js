const server = require('./server');

const test = require('dotenv').config({ path: '.env.development.local' });
console.log(test);

server.createServer();