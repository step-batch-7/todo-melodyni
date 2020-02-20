const { app } = require('./lib/routes');

const main = function() {
  const port = process.env.PORT || 9000;
  app.listen(port, () => {
    process.stderr.write(`started listening to port:${port}`);
  });
};

main();
