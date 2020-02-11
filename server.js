const http = require('http');
const { createServer } = http;
const { app } = require('./lib/handler');

const main = function() {
  const port = 9000;
  const server = createServer(app.respond.bind(app));
  server.listen(port, () => {
    process.stderr.write(`started listening to port:${port}`);
  });
};

main();
