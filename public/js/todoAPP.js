const todoTemplate = `
<div class="log">
  <h1 class="title" id="__todoId__">__title__</h1>
</div>`;

const taskTemplate = `
<div class="tasks" id="__TASK_ID__">
  <div class="checkBox"></div>
  <textarea name="Enter Task" cols="60" rows="3"></textarea>
</div>`;

const fillTemplate = function(template, propertyBag) {
  const keys = Object.keys(propertyBag);
  const replaceKeyByValue = function(template, key) {
    const pattern = new RegExp(`__${key}__`, 'g');
    return template.replace(pattern, propertyBag[key]);
  };
  const html = keys.reduce(replaceKeyByValue, template);
  return html;
};

const collectTodos = function(todo) {
  return fillTemplate(todoTemplate, todo);
};

const onTodoFetch = function(todos) {
  const todosInHTML = todos.map(collectTodos).join('');
  const list = document.querySelector('.list');
  list.innerHTML = todosInHTML;
};

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

const main = function() {
  fetchResources('/oldTodos', onTodoFetch);
};
