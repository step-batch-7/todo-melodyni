const fs = require('fs');
const { app } = require('./lib/routes');

const setUpDataBase = function() {
  const DATA_PATH = `${__dirname}/dataBase`;
  if (!fs.existsSync(DATA_PATH)) {
    fs.mkdirSync(DATA_PATH);
  }
};

const main = function() {
  setUpDataBase();
  const port = process.env.PORT || 9000;
  app.listen(port, () => {
    process.stderr.write(`started listening to port:${port}`);
  });
};

main();
