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
  sendXMLRequest('DELETE', '/deleteTask', text => displayTasks(text), message);
};

const deleteTodo = function(todoId) {
  event.stopPropagation();
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
  if (title) {
    const todoContent = JSON.stringify({ title });
    sendXMLRequest('POST', '/postNewTodos', loadHomePage, todoContent);
  }
};

const getIdAndValue = element => {
  const taskId = element.id;
  const task = element.innerText || element.value;
  return { taskId, task };
};

const updateTodo = todoId => {
  const title = document.querySelector('#todoTitle').value;
  const taskElements = Array.from(document.querySelectorAll('.task'));
  const tasks = taskElements.map(getIdAndValue);
  if (title && tasks.every(task => task.task)) {
    const todoContent = JSON.stringify({ title, tasks, todoId });
    sendXMLRequest('POST', '/updateTodo', loadHomePage, todoContent);
  }
};

const searchByTitle = searchString => {
  const todos = document.querySelectorAll('.todo');
  todos.forEach(todo => (todo.style['display'] = 'none'));
  const matchedTodos = Array.from(todos).filter(todo =>
    todo.innerText.includes(searchString)
  );
  matchedTodos.forEach(todo => (todo.style['display'] = 'flex'));
};

const showTodo = todo => {
  const todoHtml = getTodoHtml(todo.id, todo.title);
  const container = document.querySelector('.container');
  container.innerHTML = container.innerHTML + todoHtml;
  const query = `.todoDisplay[id="${todo.id}"] #items`;
  displayTasks(JSON.stringify(todo.tasks), query);
};

let todoLists = [];

const getTodos = () => {
  const attachTodoList = resText => (todoLists = JSON.parse(resText).todos);
  sendXMLRequest('GET', '/todos', attachTodoList, '');
};

const searchByTask = searchText => {
  const container = document.querySelector('.container');
  container.innerHTML = '';
  if (searchText) {
    const matchedTodos = todoLists.filter(todo =>
      todo.tasks.some(task => task.taskName.includes(searchText))
    );
    matchedTodos.forEach(showTodo);
  }
};
