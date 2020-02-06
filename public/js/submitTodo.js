const displayTodos = function(text) {};

const postTodo = function(url, data, callBack) {
  const request = new XMLHttpRequest();
  request.onload = function() {
    if (this.status === 200) {
      callBack(this.responseText);
    }
  };
  request.open('POST', url);
  request.send(JSON.stringify(data));
};

const getValue = element => element.value;

const saveTodo = function() {
  const title = document.querySelector('#todoTitle').value;
  const taskElements = Array.from(document.querySelectorAll('.taskInput'));
  const tasks = taskElements.map(getValue);
  const todoContent = { title, tasks };
  postTodo('/postNewTodos', todoContent, displayTodos);
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

const insertHTML = (selector, html) => {
  document.querySelector(selector).append(html);
};

const insertInputBox = function(event) {
  if (event.keyCode === 13) {
    insertHTML('#newTask', getTaskInputBox());
  }
};

const attachEventListener = function() {
  const titleInput = document.querySelector('#todoTitle');
  titleInput.onkeypress = insertInputBox;
};

const main = function() {
  attachEventListener();
};
