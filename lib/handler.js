const fs = require('fs');
const express = require('express');

const app = express();

const { TodoList } = require('./todoClass');
const CONTENT_TYPES = require('./mimeTypes');
const { DATABASE } = require('../config');

const getResources = function(path) {
  const allTodos = fs.readFileSync(path, 'utf8');
  return TodoList.load(allTodos);
};

const todoList = getResources(DATABASE);

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

const writeToDatabase = function(todoList) {
  fs.writeFileSync(DATABASE, todoList.toJSON(), 'utf8');
};

const saveNewTodos = function(req, res) {
  const { title, tasks } = req.body;
  todoList.save(title, tasks);
  writeToDatabase(todoList);
  serveTodos(req, res);
};

const deleteTask = function(req, res) {
  const { taskId } = req.body;
  todoList.deleteTask(taskId);
  writeToDatabase(todoList);
  const [id] = taskId.split('_');
  req.query = { id };
  serveTasks(req, res);
};

const deleteTodo = function(req, res) {
  const { todoId } = req.body;
  todoList.deleteTodo(todoId);
  writeToDatabase(todoList);
  serveTodos(req, res);
};

const toggleTaskStatus = function(req, res) {
  const { taskId } = req.body;
  todoList.toggleTaskStatus(taskId);
  writeToDatabase(todoList);
  res.end();
};

const updateTodo = (req, res) => {
  const { title, tasks, todoId } = req.body;
  todoList.updateTodo(title, tasks, todoId);
  writeToDatabase(todoList);
  res.end();
};

const hasFields = (...parameters) => {
  return function(req, res, next) {
    if (parameters.every(param => param in req.body)) {
      return next();
    }
    res.statusCode = 400;
    res.end('Bad Request');
  };
};

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));
app.get('/oldTodos', serveTodos);
app.get('/fetchTasks', serveTasks);

app.post('/postNewTodos', hasFields('title', 'tasks'), saveNewTodos);
app.post('/updateTodo', hasFields('title', 'tasks', 'todoId'), updateTodo);
app.post('/toggleTaskStatus', hasFields('taskId'), toggleTaskStatus);

app.delete('/deleteTask', hasFields('taskId'), deleteTask);
app.delete('/deleteTodo', hasFields('todoId'), deleteTodo);

module.exports = { app };
