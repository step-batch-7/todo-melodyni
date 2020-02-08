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
  add(task) {
    this.tasks.push(task);
  }
  static load(oldTodo) {
    const todo = oldTodo || { tasks: [] };
    const newTodo = new Todo(todo.id, todo.title, todo.tasks);
    return newTodo;
  }
}

class TodoList {
  constructor() {
    this.todos = [];
  }
  add(todo) {
    this.todos.push(todo);
  }
  find(id) {
    const isRequestedTodo = todo => todo.id === id;
    return this.todos.find(isRequestedTodo);
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
