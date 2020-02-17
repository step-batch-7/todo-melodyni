'use strict';

const sendXMLRequest = function(reqMethod, url, callBack, data) {
  const STATUS_CODES = { OK: 200 };
  const request = new XMLHttpRequest();
  const methods = ['POST', 'DELETE'];
  request.onload = function() {
    if (this.status === STATUS_CODES.OK) {
      callBack(this.responseText);
    }
  };
  request.open(reqMethod, url);
  if (methods.some(method => method === reqMethod)) {
    request.setRequestHeader('Content-Type', 'application/json');
  }
  request.send(data);
};

const deleteTask = function(taskId) {
  const message = JSON.stringify({ taskId });
  sendXMLRequest('DELETE', '/deleteTask', displayTasks, message);
};

const deleteTodo = function(todoId) {
  const message = JSON.stringify({ todoId });
  sendXMLRequest('DELETE', '/deleteTodo', displayTodos, message);
};

const toggleTaskStatus = function(taskId) {
  const message = JSON.stringify({ taskId });
  sendXMLRequest('POST', '/toggleTaskStatus', () => {}, message);
};

const getValue = element => element.value;

const saveTodo = function() {
  const title = document.querySelector('#todoTitle').value;
  const taskElements = Array.from(document.querySelectorAll('.taskInput'));
  const tasks = taskElements.map(getValue);
  const todoContent = JSON.stringify({ title, tasks });
  sendXMLRequest('POST', '/postNewTodos', loadHomePage, todoContent);
};

const getIdAndValue = element => {
  const taskId = element.id;
  const task = element.value;
  return { taskId, task };
};

const updateTodo = todoId => {
  const title = document.querySelector('#todoTitle').value;
  const taskElements = Array.from(document.querySelectorAll('.task'));
  const tasks = taskElements.map(getIdAndValue);
  const todoContent = JSON.stringify({ title, tasks, todoId });
  sendXMLRequest('POST', '/updateTodo', loadHomePage, todoContent);
};

const searchByTitle = searchString => {
  const todos = document.querySelectorAll('.todo');
  todos.forEach(todo => (todo.style['display'] = 'none'));
  const matchedTodos = Array.from(todos).filter(todo =>
    todo.innerText.includes(searchString)
  );
  matchedTodos.forEach(todo => todo.style['display'] = 'flex');
};

const searchByTask = searchText => {};