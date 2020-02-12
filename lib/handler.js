const fs = require('fs');
const querystring = require('querystring');
const { App } = require('./app');
const { TodoList } = require('./todoClass');
const CONTENT_TYPES = require('./mimeTypes');
const PUBLIC_FOLDER = `${__dirname}/../public`;
const { DATABASE } = require('../config');

const getResources = function(path) {
  const allTodos = fs.readFileSync(path, 'utf8');
  return TodoList.load(allTodos);
};

const todoList = getResources(DATABASE);

const getAbsolutePath = function(requestUrl) {
  return requestUrl === '/'
    ? `${PUBLIC_FOLDER}/index.html`
    : `${PUBLIC_FOLDER}${requestUrl}`;
};

const doesFileExist = function(path) {
  return fs.existsSync(path) && fs.statSync(path).isFile();
};

const methodNotAllowed = function(request, response) {
  response.statusCode = 405;
  response.end('Method Not Allowed');
};

const serveNotFoundPage = function(req, res) {
  res.statusCode = 404;
  res.end('File Not Found');
};

const serveStaticPage = function(req, res, next) {
  const absolutePath = getAbsolutePath(req.url);
  if (!doesFileExist(absolutePath)) {
    next();
    return;
  }
  const content = fs.readFileSync(absolutePath);
  respondOnGet(res, content, absolutePath);
};

const extractHead = function(todo) {
  const { id, title, status } = todo;
  return { id, title, status };
};

const serveTodos = function(req, res) {
  const todoHead = JSON.stringify(todoList.todos.map(extractHead));
  respondOnGet(res, todoHead, 'todos.json');
};

const extractField = ({ taskId, taskName, status }) => {
  return { taskId, taskName, status };
};

const serveTasks = function(req, res) {
  const { id } = req.query;
  const todo = todoList.findTodo(id);
  const taskHead = todo ? JSON.stringify(todo.tasks.map(extractField)) : '';
  respondOnGet(res, taskHead, 'todos.json');
};

const respondOnGet = function(res, content, path) {
  const extension = path.split('.').pop();
  res.setHeader('Content-Type', CONTENT_TYPES[extension]);
  res.setHeader('Content-Length', content.length);
  res.end(content);
};

const readBody = function(req, res, next) {
  let data = '';
  req.on('data', chunk => {
    data += chunk;
  });
  req.on('end', () => {
    req.body = data;
    next();
  });
};

const readQueryParams = function(req, res, next) {
  const [, query] = req.url.split('?');
  req.query = querystring.parse(query);
  next();
};

const writeToDatabase = function(todoList) {
  fs.writeFileSync(DATABASE, todoList.toJSON(), 'utf8');
};

const saveNewTodos = function(req, res) {
  const { title, tasks } = JSON.parse(req.body);
  todoList.save(title, tasks);
  writeToDatabase(todoList);
  serveTodos(req, res);
};

const deleteTask = function(req, res) {
  todoList.deleteTask(req.body);
  writeToDatabase(todoList);
  const [id] = req.body.split('_');
  req.query = { id };
  serveTasks(req, res);
};

const deleteTodo = function(req, res) {
  todoList.deleteTodo(req.body);
  writeToDatabase(todoList);
  serveTodos(req, res);
};

const toggleTaskStatus = function(req, res) {
  todoList.toggleTaskStatus(req.body);
  writeToDatabase(todoList);
  res.end();
};

const updateTodo = (req, res) => {
  const { title, tasks, todoId } = JSON.parse(req.body);
  todoList.updateTodo(title, tasks, todoId);
  writeToDatabase(todoList);
  res.end();
};

const app = new App();
app.use(readBody);
app.use(readQueryParams);

app.get('', serveStaticPage);
app.get('/oldTodos', serveTodos);
app.get('/fetchTasks', serveTasks);
app.get('', serveNotFoundPage);

app.post('/postNewTodos', saveNewTodos);
app.post('/updateTodo', updateTodo);
app.post('/toggleTaskStatus', toggleTaskStatus);

app.delete('/deleteTask', deleteTask);
app.delete('/deleteTodo', deleteTodo);

app.use(methodNotAllowed);
module.exports = { app };
