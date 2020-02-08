const { readFileSync, writeFileSync, existsSync, statSync } = require('fs');
const querystring = require('querystring');
const { App } = require('./app');
const { TodoList } = require('./todoClass');
const CONTENT_TYPES = require('./mimeTypes');

const PUBLIC_FOLDER = `${__dirname}/../public`;
const { DATABASE } = require('../config');

const getResources = function(path) {
  const allTodos = readFileSync(path, 'utf8');
  return allTodos ? TodoList.load(allTodos) : new TodoList();
};

const allTodos = getResources(DATABASE).todos;

const methodNotAllowed = function(request, response) {
  response.writeHead(405, 'Method Not Allowed');
  response.end();
};

const getAbsolutePath = function(requestUrl) {
  return requestUrl === '/'
    ? `${PUBLIC_FOLDER}/index.html`
    : `${PUBLIC_FOLDER}${requestUrl}`;
};

const serveNotFoundPage = function(req, res) {
  res.writeHead(404, 'File Not Found');
  res.end();
};

const doesFileExist = function(path) {
  return existsSync(path) && statSync(path).isFile();
};

const serveStaticPage = function(req, res, next) {
  const absolutePath = getAbsolutePath(req.url);
  if (!doesFileExist(absolutePath)) {
    next();
    return;
  }
  const content = readFileSync(absolutePath);
  respondOnGet(res, content, absolutePath);
};

const extractHead = function(todo) {
  const { id, title, status } = todo;
  return { id, title, status };
};

const serveTodos = function(req, res) {
  const todoHead = JSON.stringify(allTodos.map(extractHead));
  respondOnGet(res, todoHead, 'a.txt');
};

const extractField = function(task) {
  const { taskId, taskName, status } = task;
  return { taskId, taskName, status };
};

const serveTasks = function(req, res) {
  const { id } = req.query;
  const todo = getRequestedTodo(id);
  const taskHead = todo ? JSON.stringify(todo.tasks.map(extractField)) : '';
  // console.log('-->', todo, taskHead);
  respondOnGet(res, taskHead, 'a.txt');
};

const respondOnGet = function(res, content, path) {
  const extension = path.split('.').pop();
  res.setHeader('Content-Type', CONTENT_TYPES[extension]);
  res.setHeader('Content-Length', content.length);
  res.end(content);
};

const readBody = function(req, res, next) {
  let data = '';
  req.on('data', chunk => (data += chunk));
  req.on('end', () => {
    req.body = data;
    next();
  });
};

const readQueryParams = function(req, res, next) {
  req.query = querystring.parse(req.url.split('?')[1]);
  next();
};

const writeToDatabase = function(todoList) {
  writeFileSync(DATABASE, todoList.toJSON(), 'utf8');
};

const saveNewTodos = function(req, res) {
  const { title, tasks } = JSON.parse(req.body);
  const content = JSON.stringify([
    {
      id: `${new Date().getTime()}`,
      title,
      tasks
    }
  ]);
  const todoList = TodoList.load(content);
  writeToDatabase(todoList);
  res.end();
};

const getRequestedTodo = function(id) {
  const isRequestedTodo = todo => todo.id === id;
  return allTodos.find(isRequestedTodo);
};

const deleteTask = function(req, res) {
  res.end();
};

const app = new App();
app.use(readBody);
app.use(readQueryParams);
app.get('', serveStaticPage);
app.get('/tasks.html', serveStaticPage);
app.get('/oldTodos', serveTodos);
app.get('/fetchTasks', serveTasks);
app.post('/postNewTodos', saveNewTodos);
app.delete('/deleteTask', deleteTask);
app.get('', serveNotFoundPage);
app.use(methodNotAllowed);

module.exports = { app };
