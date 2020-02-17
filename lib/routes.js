'use strict';

const express = require('express');
const cookieParser = require('cookie-parser');

const app = express();

const {
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
  logout
} = require('./handler');

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
app.use(cookieParser());

app.use(getUser);

app.get('/fetchTodos', serveTodos);
app.get('/fetchTasks', serveTasks);
app.get('/', redirectToHome);
app.get('/homePage.html', redirectToLogin);
app.get('/logout', logout);

app.use(express.static('public'));

app.post('/postNewTodos', hasFields('title'), saveNewTodos);
app.post('/updateTodo', hasFields('title', 'tasks', 'todoId'), updateTodo);
app.post('/toggleTaskStatus', hasFields('taskId'), toggleTaskStatus);
app.post('/login', hasFields('userName', 'password'), login);
app.post(
  '/signUp',
  hasFields('fullName', 'mail', 'userName', 'password', 'confirmPassword'),
  signUp
);

app.delete('/deleteTask', hasFields('taskId'), deleteTask);
app.delete('/deleteTodo', hasFields('todoId'), deleteTodo);

module.exports = { app };
