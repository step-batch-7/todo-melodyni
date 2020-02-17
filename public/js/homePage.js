'use strict';

const loadHomePage = () => {
  sendXMLRequest('GET', 'fetchTodos', displayTodos);
  document.querySelector('.container').innerHTML = '';
};

const hideIndicator = function() {
  const todos = document.querySelectorAll('.indicator');
  todos.forEach(todo => todo.classList.remove('indicator'));
};

const getTodoForm = () => {
  hideIndicator();
  const html = `
  <div id="todoDisplay" class="todoDisplay">
  <div class="navBar">
    <img src="images/save.png" alt="save" onclick="saveTodo()" class="save"/>
    <input type="text" id="todoTitle" placeholder="Enter Todo Name...." >
    <img src="images/cross.png" alt="close" class="close" 
      onclick="loadHomePage()">
  </div>
  <hr />
  </div>`;
  insertHTML('.container', html);
};

const addInputBox = () => {
  appendHTML('#items', getTaskInputBox('task'));
};

const getTodoHtml = (todoId, title) => {
  return `
  <div class="todoDisplay" id="${todoId}">
  <div class="navBar">
    <img src="images/save.png" alt="save" class="save" 
      onclick="updateTodo(${todoId})"/>
    <input type="text" id="todoTitle" value="${title}">
    <img src="images/add.png" alt="add" class="close" 
      onclick="addInputBox()"/>
    <img src="images/cross.png" alt="cross" class="close" 
      onclick="loadHomePage()"/>
  </div>
  <hr />
  <br />
  <div id="items"></div>
  </div>`;
};

const loadTasks = (todoId, title) => {
  hideIndicator();
  const todo = document.querySelector(`.todo[id="${todoId}"`);
  todo.classList.add('indicator');
  insertHTML('.container', getTodoHtml(todoId, title));
  sendXMLRequest('GET', `/fetchTasks?id=${todoId}`, (text) => displayTasks(text), '');
};

const getTaskInputBox = function(inputClass) {
  const html = document.createElement('div');
  html.innerHTML = `
  <input type="checkbox" class="checkBox __status__">
  <input type="text" class="${inputClass}">`;
  html.className = 'taskBox';
  html.id = '__taskId__';
  return html;
};

const appendHTML = (selector, html) => {
  document.querySelector(selector).append(html);
};

const insertHTML = (selector, html) => {
  document.querySelector(selector).innerHTML = html;
};

const fillTemplate = function(template, propertyBag) {
  const keys = Object.keys(propertyBag);
  const replaceKeyByValue = function(template, key) {
    const pattern = new RegExp(`__${key}__`, 'g');
    return template.replace(pattern, propertyBag[key]);
  };
  const html = keys.reduce(replaceKeyByValue, template);
  return html;
};

const generateTaskDiv = task => fillTemplate(taskTemplate, task);

const displayTasks = function(responseText, query = '#items') {
  const tasks = JSON.parse(responseText);
  insertHTML(query, tasks.map(generateTaskDiv).join('\n'));
};

const todoTemplate = `
  <div class="todo" id="__id__" onclick="loadTasks('__id__', '__title__')" > 
    <h1 class="title" >__title__</h1>
    <div style="display:flex;justify-content:space-between;">
    <img src="/images/bin.png" alt="delete" class="deleteButton"
      onclick="deleteTodo('__id__')">
    </div>
  </div>`;

const taskTemplate = `
<div class="taskBox" id="__taskId__">
  <input type="checkbox" id="taskId" class="checkBox" 
    onclick="toggleTaskStatus('__taskId__')" __status__>
  <input type="text" class="task" value="__taskName__" id="__taskId__">
  <img src="/images/bin.png" class="deleteButton" alt="delete" 
    onclick="deleteTask('__taskId__')">
</div>`;

const generateTodoDiv = todo => fillTemplate(todoTemplate, todo);

const displayTodos = responseText => {
  const todos = JSON.parse(responseText);
  return insertHTML('#todo', todos.map(generateTodoDiv).join('\n'));
};

const main = () => loadHomePage();

window.onload = main;
