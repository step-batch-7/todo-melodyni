const http = require('http');
const { createServer } = http;
const { app } = require('./lib/handler');

const main = function() {
  const server = createServer(app.respond.bind(app));
  server.listen(9000, () => console.log('started listening'));
};

main();
