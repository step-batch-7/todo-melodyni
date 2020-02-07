class Task {
  constructor(taskId, task, status) {
    this.taskId = taskId;
    this.task = task;
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
    const newTodo = new Todo(todo.id, todo.title);
    let id = 0;
    todo.tasks.forEach(task => {
      let taskId = `${newTodo.id}_${id++}`;
      newTodo.add(new Task(taskId, task, false));
    });
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
  static load(content) {
    const allTodos = JSON.parse(content || []);
    let todos = new TodoList();
    allTodos.forEach(oldTodo => {
      todos.add(Todo.load(oldTodo));
    });
    return todos;
  }
  toJSON() {
    return JSON.stringify(this.todos);
  }
}

module.exports = { TodoList };
