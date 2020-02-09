let num = 0;

class Task {
  constructor(taskId, task, status) {
    this.taskId = taskId;
    this.taskName = task;
    this.status = status;
  }
}

class Todo {
  constructor(id, title, tasks = []) {
    this.id = id;
    this.title = title;
    this.tasks = tasks;
  }
  generateTaskId() {
    return `${this.id}_${num++}`;
  }
  add(task) {
    this.tasks.unshift(task);
  }
  findTask(taskId) {
    const isRequestedTask = task => task.taskId === taskId;
    return this.tasks.find(isRequestedTask);
  }
  findIndex(id) {
    const task = this.findTask(id);
    return this.tasks.indexOf(task);
  }
  static load(oldTodo) {
    const todo = oldTodo || { tasks: [] };
    const newTodo = new Todo(todo.id, todo.title, todo.tasks);
    return newTodo;
  }
  save(taskName) {
    const taskId = this.generateTaskId();
    this.add(new Task(taskId, taskName, false));
  }
  deleteTask(id) {
    delete this.tasks[this.findIndex(id)];
    this.tasks = this.tasks.filter(task => task);
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
  findTodo(id) {
    const isRequestedTodo = todo => todo.id === id;
    return this.todos.find(isRequestedTodo);
  }
  findIndex(id) {
    const todo = this.findTodo(id);
    return this.todos.indexOf(todo);
  }
  save(title, tasks) {
    const todoId = this.generateTodoId();
    const newTodo = new Todo(todoId, title, []);
    tasks.forEach(task => {
      newTodo.save(task);
    });
    this.add(newTodo);
  }
  deleteTask(id) {
    const [todoId] = id.split('_');
    const todo = this.findTodo(todoId);
    todo.deleteTask(id);
  }
  deleteTodo(id) {
    delete this.todos[this.findIndex(id)];
    this.todos = this.todos.filter(todo => todo);
  }
  static load(content) {
    const allTodos = JSON.parse(content || []);
    let todos = new TodoList();
    allTodos.forEach(oldTodo => {
      todos.add(Todo.load(oldTodo));
    });
    return todos;
  }
  toJSON() {
    return JSON.stringify(this.todos, null, 2);
  }
}

module.exports = { TodoList, Todo, Task };
