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
const displayTasks = function(tasks) {
  insertHTML('#items', tasks.map(generateTaskDiv).join('\n'));
  show('#secondPage');
};

const loadTasks = todoId => {
  hide('#firstPage');
  show('#secondPage');
  fetchResources(`/fetchTasks?id=${todoId}`, displayTasks);
};

const todoTemplate = `
<div class="log" id="__id__" onclick="loadTasks('__id__')" > 
  <h1 class="title" id="__id__">
    <span>__title__</span>
  </h1>
</div>`;

const taskTemplate = `
<div class="taskBox" id="__taskId__">
  <input type="checkbox" class="checkBox __status__">
  <div class="task">__taskName__</div>
</div><br>`;

const fetchResources = function(url, callBack) {
  const request = new XMLHttpRequest();
  request.onload = function() {
    if (this.status === 200) {
      callBack(JSON.parse(this.responseText));
    }
  };
  request.open('GET', url);
  request.send();
};

const displayTodos = todos =>
  insertHTML('#todo', todos.map(generateTodoDiv).join('\n'));

const main = () => fetchResources('oldTodos', displayTodos);

window.onload = main;
