const onTasksFetch = function(tasks) {
  const tasksInHtml = tasks.map(collectTASK).join('');
  const taskList = document.querySelector('#items');
  taskList.innerHTML = tasksInHtml;
};

const getTasksById = function(event) {
  const firstPage = document.querySelector('#firstPage');
  firstPage.style.display = 'none';
  const secondPage = document.querySelector('#secondPage');
  secondPage.style.display = 'block';
  const id = event.target.getAttribute('id');
  fetchResources(`/fetchTasks?id=${id}`, onTasksFetch);
};

const onTodoFetch = function(todos) {
  const tasksInHtml = todos.map(collectTODO).join('');
  const taskList = document.querySelector('#todo');
  taskList.innerHTML = tasksInHtml;
};

const todoMain = function() {
  fetchResources('/oldTodos', onTodoFetch);
};
