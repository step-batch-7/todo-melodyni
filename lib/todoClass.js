class Task {
  constructor(taskId, task, status) {
    this.taskId = taskId;
    this.taskName = task;
    this.status = status;
  }
  toggleStatus() {
    if (this.status === 'checked') {
      this.status = '';
    } else {
      this.status = 'checked';
    }
  }
}
class Todo {
  constructor(id, title, tasks) {
    this.id = id;
    this.title = title;
    this.tasks = tasks;
  }
  generateTaskId() {
    const lastTask = this.tasks.slice().pop();
    let [, taskId] = lastTask ? lastTask.taskId.split('_') : [, 0];
    return `${this.id}_${++taskId}`;
  }
  add(task) {
    this.tasks.push(task);
  }
  findTask(taskId) {
    const isRequestedTask = task => task.taskId === taskId;
    return this.tasks.find(isRequestedTask);
  }
  findIndex(taskId) {
    const task = this.findTask(taskId);
    return this.tasks.indexOf(task);
  }
  save(taskName) {
    const taskId = this.generateTaskId();
    this.add(new Task(taskId, taskName, 'unchecked'));
  }
  editTask(taskId, editedTask) {
    const task = this.findTask(taskId);
    task.taskName = editedTask;
  }
  toggleTaskStatus(taskId) {
    const task = this.findTask(taskId);
    task.toggleStatus();
  }
  deleteTask(id) {
    const noOfTasks = 1;
    this.tasks.splice(this.findIndex(id), noOfTasks);
  }
  static load(todo) {
    const newTodo = new Todo(todo.id, todo.title, []);
    newTodo.tasks = todo.tasks.map(
      task => new Task(task.taskId, task.taskName, task.status)
    );
    return newTodo;
  }
}

class TodoList {
  constructor() {
    this.todos = [];
  }
  generateTodoId() {
    return `${new Date().getTime()}`;
  }
  add(todo) {
    this.todos.unshift(todo);
  }
  findTodo(todoId) {
    const isRequestedTodo = todo => todo.id === todoId;
    return this.todos.find(isRequestedTodo);
  }
  findIndex(todoId) {
    const todo = this.findTodo(todoId);
    return this.todos.indexOf(todo);
  }
  extractTodoId(taskId) {
    const [todoId] = taskId.split('_');
    return todoId;
  }
  save(title, tasks) {
    const todoId = this.generateTodoId();
    const newTodo = new Todo(todoId, title, []);
    tasks.forEach(task => {
      newTodo.save(task);
    });
    this.add(newTodo);
  }
  toggleTaskStatus(taskId) {
    const todoId = this.extractTodoId(taskId);
    const todo = this.findTodo(todoId);
    todo.toggleTaskStatus(taskId);
  }
  editTask(taskId, editedTask) {
    const todoId = this.extractTodoId(taskId);
    const todo = this.findTodo(todoId);
    todo.editTask(taskId, editedTask);
  }
  deleteTask(taskId) {
    const todoId = this.extractTodoId(taskId);
    const todo = this.findTodo(todoId);
    todo.deleteTask(taskId);
  }
  deleteTodo(todoId) {
    const noOfTodos = 1;
    this.todos.splice(this.findIndex(todoId), noOfTodos);
  }
  toJSON() {
    return JSON.stringify(this.todos);
  }
  static load(content) {
    const allTodos = JSON.parse(content || '[]');
    const todos = new TodoList();
    allTodos.forEach(oldTodo => {
      todos.add(Todo.load(oldTodo));
    });
    return todos;
  }
}

module.exports = { TodoList, Todo, Task };
