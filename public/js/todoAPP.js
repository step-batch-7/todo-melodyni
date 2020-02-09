const goToHome = function(responseText) {};

const deleteTask = function(id) {
  sendXMLRequest('DELETE', '/deleteTask', goToHome, id);
};

const deleteTodo = function(id) {
  sendXMLRequest('DELETE', '/deleteTodo', goToHome, id);
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
  <input type="text" class="taskInput" onkeypress="insertInputBox(event)"></input>`;
  html.className = 'taskBox';
  html.id = '__taskId__';
  return html;
};

const appendHTML = (selector, html) => {
  document.querySelector(selector).append(html);
};

const insertInputBox = function(event) {
  if (event.keyCode === 13) {
    appendHTML('#newTask', getTaskInputBox());
  }
};

const attachEventListener = function() {
  const titleInput = document.querySelector('#todoTitle');
  titleInput.onkeypress = insertInputBox;
};

const generateTodoDiv = todo => fillTemplate(todoTemplate, todo);

const insertHTML = (selector, html) =>
  (document.querySelector(selector).innerHTML = html);

const hide = selector =>
  document.querySelector(selector).classList.add('hidden');

const show = selector =>
  document.querySelector(selector).classList.remove('hidden');

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
  show('#secondPage');
};

const loadTasks = todoId => {
  hide('#firstPage');
  show('#secondPage');
  sendXMLRequest('GET', `/fetchTasks?id=${todoId}`, displayTasks, '');
};

const todoTemplate = `
<div style="display:flex;justify-content:end;margin:0px" >
  <div class="log" id="__id__" onclick="loadTasks('__id__')" > 
    <h1 class="title" id="__id__">__title__</h1>
  </div>
  <img src="/images/bin.png" class="miniImg" alt="delete" onclick="deleteTodo('__id__')"></img>
</div>`;

const taskTemplate = `
<div class="taskBox" id="__taskId__">
  <input type="checkbox" class="checkBox __status__">
  <div class="task">__taskName__</div>
  <img src="/images/bin.png" class="miniImg" alt="delete" onclick="deleteTask('__taskId__')"></img>
</div><br>`;

const sendXMLRequest = function(method, url, callBack, data) {
  const request = new XMLHttpRequest();
  request.onload = function() {
    if (this.status === 200) {
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
