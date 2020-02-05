const { readFileSync, writeFileSync, existsSync, statSync } = require('fs');
const querystring = require('querystring');
const { App } = require('./app');
const CONTENT_TYPES = require('./mimeTypes');

const PUBLIC_FOLDER = `${__dirname}/../public`;
const DATABASE = `${__dirname}/../dataBase/todos.json`;
const TODOS = JSON.parse(readFileSync(DATABASE, 'utf8'));

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
  respondOnGet(response, content, absolutePath);
};

const extractHead = function(todo) {
  const { id, title, status } = todo;
  return { id, title, status };
};

const serveTodos = function(request, response) {
  const todoHead = JSON.stringify(TODOS.map(extractHead));
  respondOnGet(response, todoHead, 'a.txt');
};

const extractField = function(task) {
  const { taskId, taskName, status } = task;
  return { taskId, taskName, status };
};

const byMatchingID = function(id) {
  return function(todo) {
    return todo.id === id;
  };
};

const serveTasks = function(request, response) {
  const id = querystring.parse(request.url.split('?')[1]).id;
  const requestedTodo = TODOS.filter(byMatchingID(id))[0];
  const taskHead = JSON.stringify(requestedTodo.tasks.map(extractField));
  respondOnGet(response, taskHead, 'a.txt');
};

const respondOnGet = function(response, content, path) {
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
app.get('/tasks.html', serveStaticPage);
app.get('/oldTodos', serveTodos);
app.get('/fetchTasks', serveTasks);
app.get('', serveNotFoundPage);
app.use(methodNotAllowed);

module.exports = { app };
