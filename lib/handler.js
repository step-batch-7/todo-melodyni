const fs = require('fs');

// const { TodoList } = require('./todoClass');
const { UserList } = require('./userClass');
const CONTENT_TYPES = require('./mimeTypes');
const { DATABASE } = require('../config');

const getResources = function(path) {
  const usersContent = fs.readFileSync(path, 'utf8');
  return UserList.load(usersContent);
};

const userList = getResources(DATABASE);
// const userList = UserList.load(
//   JSON.stringify([
//     {
//       name: 'naveen',
//       password: 'password',
//       id: '123',
//       data: [
//         {
//           id: '123',
//           title: 'title',
//           tasks: [{ taskId: '123_1', taskName: 'hello', status: 'checked' }]
//         }
//       ]
//     }
//   ])
// );

const extractHead = function(todo) {
  const { id, title, status } = todo;
  return { id, title, status };
};

const serveTodos = function(req, res) {
  const todoList = userList.getData(req.user);
  const todoHead = JSON.stringify(todoList.todos.map(extractHead));
  respondOnGet(res, todoHead, 'todos.json');
};

const extractField = ({ taskId, taskName, status }) => {
  return { taskId, taskName, status };
};

const serveTasks = function(req, res) {
  const { id } = req.query;
  const todoList = userList.getData(req.user);
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

const writeToDatabase = function(userList) {
  fs.writeFileSync(DATABASE, userList.toJSON(), 'utf8');
};

const saveNewTodos = function(req, res) {
  const { title, tasks } = req.body;
  const todoList = userList.getData(req.user);
  todoList.save(title, tasks);
  writeToDatabase(userList);
  serveTodos(req, res);
};

const deleteTask = function(req, res) {
  const { taskId } = req.body;
  const todoList = userList.getData(req.user);
  todoList.deleteTask(taskId);
  writeToDatabase(userList);
  const [id] = taskId.split('_');
  req.query = { id };
  serveTasks(req, res);
};

const deleteTodo = function(req, res) {
  const { todoId } = req.body;
  const todoList = userList.getData(req.user);
  todoList.deleteTodo(todoId);
  writeToDatabase(userList);
  serveTodos(req, res);
};

const toggleTaskStatus = function(req, res) {
  const { taskId } = req.body;
  const todoList = userList.getData(req.user);
  todoList.toggleTaskStatus(taskId);
  writeToDatabase(userList);
  res.end();
};

const updateTodo = (req, res) => {
  const { title, tasks, todoId } = req.body;
  const todoList = userList.getData(req.user);
  todoList.updateTodo(title, tasks, todoId);
  writeToDatabase(userList);
  res.end();
};

const login = (req, res) => {
  const { userName, password } = req.body;
  if (userList.isAuthorized(userName, password)) {
    res.cookie('sessionId', session[userName]);
    res.redirect('homePage.html');
    return;
  }
  res.redirect('/');
};

const redirectToLogin = (req, res, next) => {
  const user = req.user;
  return user ? next() : res.redirect('/');
};

const redirectToHome = (req, res, next) => {
  const user = req.user;
  return user ? res.redirect('/homePage.html') : next();
};

const session = { naveen: '1234', ragini: '1235', sravani: '1236' };
const sessions = { '1234': 'naveen', '1235': 'ragini', '1236': 'sravani' };

const getUser = (req, res, next) => {
  const sessionId = req.cookies.sessionId;
  if (sessionId) {
    req.user = sessions[sessionId];
  }
  next();
};

module.exports = {
  serveTodos,
  serveTasks,
  saveNewTodos,
  updateTodo,
  toggleTaskStatus,
  deleteTodo,
  deleteTask,
  login,
  getUser,
  redirectToHome,
  redirectToLogin
};
