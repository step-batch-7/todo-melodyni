const fs = require('fs');

const { UserList } = require('./userClass');
const CONTENT_TYPES = require('./mimeTypes');
const { DATABASE } = require('../config');

const getResources = function(path) {
  let usersContent = [];
  if (fs.existsSync(path)) {
    usersContent = fs.readFileSync(path, 'utf8');
  }
  return UserList.load(usersContent);
};

const userList = getResources(DATABASE);

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
  const { title } = req.body;
  const todoList = userList.getData(req.user);
  todoList.save(title);
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
    const user = userList.findUser(userName);
    res.cookie('sessionId', user.id);
    res.redirect('homePage.html');
    return;
  }
  res.end('UserName or Password is incorrect');
};

const signUp = (req, res) => {
  if (userList.isExistingUser(req.body.userName)) {
    res.end(`User Name ${req.body.userName} Already in use`);
    return;
  }
  userList.save(req.body);
  writeToDatabase(userList);
  res.redirect('/');
};

const logout = (req, res) => {
  res.clearCookie('sessionId');
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

const getUser = (req, res, next) => {
  const users = userList.getUsers();
  const sessionId = req.cookies.sessionId;
  if (sessionId) {
    const user = users.find(user => user.id === sessionId);
    req.user = user && user.name;
  }
  next();
};

const renderTodos = (req, res) => {
  const todos = JSON.stringify(userList.getData(req.user));
  respondOnGet(res, todos, 'todos.json');
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
  redirectToLogin,
  signUp,
  logout,
  renderTodos
};
