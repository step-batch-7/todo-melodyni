const { app } = require('./lib/handler');

const main = function() {
  const port = 9000;
  app.listen(port, () => {
    process.stderr.write(`started listening to port:${port}`);
  });
};

main();
