const { readFileSync, writeFileSync, existsSync, statSync } = require('fs');
const querystring = require('querystring');
const { App } = require('./app');
const CONTENT_TYPES = require('./mimeTypes');

const PUBLIC_FOLDER = `${__dirname}/../public`;
const DATABASE = `${__dirname}/../dataBase/todos.json`;

const methodNotAllowed = function(request, response) {
  response.writeHead(405, 'Method Not Allowed');
  response.end();
};

const getAbsolutePath = function(requestUrl) {
  return requestUrl === '/'
    ? `${PUBLIC_FOLDER}/index.html`
    : `${PUBLIC_FOLDER}${requestUrl}`;
};

const serveNotFoundPage = function(request, response) {
  response.writeHead(404, 'File Not Found');
  response.end();
};

const doesFileExist = function(path) {
  return existsSync(path) && statSync(path).isFile();
};

const serveStaticPage = function(request, response, performNext) {
  const absolutePath = getAbsolutePath(request.url);
  if (!doesFileExist(absolutePath)) {
    performNext();
    return;
  }
  const content = readFileSync(absolutePath);
  respondOnGet(absolutePath, content, response);
};

const serveTodos = function(request, response) {
  const todos = readFileSync(DATABASE);
  response.setHeader('Content-Type', 'text/plain');
  response.setHeader('Content-Length', todos.length);
  response.end(todos);
};

const respondOnGet = function(path, content, response) {
  const extension = path.split('.').pop();
  response.setHeader('Content-Type', CONTENT_TYPES[extension]);
  response.setHeader('Content-Length', content.length);
  response.end(content);
};

const readBody = function(req, res, next) {
  let data = '';
  req.on('data', chunk => (data += chunk));
  req.on('end', () => {
    req.body = data;
    next();
  });
};

const app = new App();
app.use(readBody);
app.get('', serveStaticPage);
app.get('/oldTodo', serveTodos);
app.get('', serveNotFoundPage);
app.use(methodNotAllowed);

module.exports = { app };
