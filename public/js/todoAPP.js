const goToHome = function(responseText) {};

const deleteTask = function(taskId) {
  sendXMLRequest('DELETE', '/deleteTask', goToHome, taskId);
};

const deleteTodo = function(todoId) {
  sendXMLRequest('DELETE', '/deleteTodo', goToHome, todoId);
};

const toggleTaskStatus = function(taskId) {
  sendXMLRequest('POST', '/toggleTaskStatus', goToHome, taskId);
};

const editTask = function(taskId) {
  if (event.key === 'Enter') {
    const editedTask = event.target.innerHTML;
    const content = JSON.stringify({ editedTask, taskId });
    sendXMLRequest('POST', '/editTask', goToHome, content);
  }
};

const getTodoForm = () => {
  const html = `
  <div class="navBar">
    <img src="images/save.png" alt="save" onclick="saveTodo()" class="save"/>
    <input type="text" id="todoTitle" placeholder="Enter Todo Name...." >
    <a href="index.html"><img src="images/cross.png" alt="close" 
      class="close"></a>
  </div>
  <hr />
  <br />
  <div id="newTask"></div>`;
  insertHTML('#todoDisplay', html);
  const todoDisplay = document.querySelector('#todoDisplay');
  todoDisplay.style['background-color'] = '#3b4446';
  attachEventListener();
};

const getValue = element => element.value;

const saveTodo = function() {
  const title = document.querySelector('#todoTitle').value;
  const taskElements = Array.from(document.querySelectorAll('.taskInput'));
  const tasks = taskElements.map(getValue);
  const todoContent = JSON.stringify({ title, tasks });
  sendXMLRequest('POST', '/postNewTodos', goToHome, todoContent);
};

const getTaskInputBox = function() {
  const html = document.createElement('div');
  html.innerHTML = `
  <input type="checkbox" class="checkBox __status__">
  <input type="text" class="taskInput" onkeypress="insertInputBox(event)">`;
  html.className = 'taskBox';
  html.id = '__taskId__';
  return html;
};

const appendHTML = (selector, html) => {
  document.querySelector(selector).append(html);
};

const insertInputBox = function() {
  if (event.key === 'Enter') {
    appendHTML('#newTask', getTaskInputBox());
  }
};

const attachEventListener = function() {
  const titleInput = document.querySelector('#todoTitle');
  titleInput.onkeypress = insertInputBox;
};

const generateTodoDiv = todo => fillTemplate(todoTemplate, todo);

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
const displayTasks = function(responseText) {
  const tasks = JSON.parse(responseText);
  insertHTML('#items', tasks.map(generateTaskDiv).join('\n'));
};

const loadTasks = (todoId, title) => {
  const html = `
  <div class="navBar">
    <img src="images/save.png" alt="save" class="save"/>
    <input type="text" id="todoTitle" placeholder="Enter Todo Name...." 
      value="${title}">
    <a href="index.html"><img src="images/cross.png" alt="cross"
      class="close"/></a>
  </div>
  <hr />
  <br />
  <div id="items"></div>`;
  insertHTML('#todoDisplay', html);
  const todoDisplay = document.querySelector('#todoDisplay');
  todoDisplay.style['background-color'] = '#3b4446';
  sendXMLRequest('GET', `/fetchTasks?id=${todoId}`, displayTasks, '');
};

const todoTemplate = `
  <div class="todo" id="__id__" > 
    <h1 class="title" >__title__</h1>
    <div style="display:flex;justify-content:space-between;">
    <img src="/images/bin.png" alt="delete" class="deleteButton"
      onclick="deleteTodo('__id__')">
    <img src="/images/open.png" alt="open" class="openButton"
      onclick="loadTasks('__id__', '__title__')" >
    </div>
  </div>`;

const taskTemplate = `
<div class="taskBox" id="__taskId__">
  <input type="checkbox" id="taskId" class="checkBox" 
    onclick="toggleTaskStatus('__taskId__')" __status__>
  <div class="task">
    <h6 contenteditable onkeypress="editTask('__taskId__')" >__taskName__</h6>
  </div>
  <img src="/images/bin.png" class="deleteButton" alt="delete" 
    onclick="deleteTask('__taskId__')">
</div>`;

const sendXMLRequest = function(method, url, callBack, data) {
  const STATUS_CODES = { OK: 200 };
  const request = new XMLHttpRequest();
  request.onload = function() {
    if (this.status === STATUS_CODES.OK) {
      callBack(this.responseText);
    }
  };
  request.open(method, url);
  request.send(data);
};

const displayTodos = responseText => {
  const todos = JSON.parse(responseText);
  return insertHTML('#todo', todos.map(generateTodoDiv).join('\n'));
};

const main = () => sendXMLRequest('GET', 'oldTodos', displayTodos);

window.onload = main;
