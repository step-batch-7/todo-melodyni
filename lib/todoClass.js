class Task {
  constructor(taskId, task, status) {
    this.taskId = taskId;
    this.taskName = task;
    this.status = status;
  }
  toggleStatus() {
    const status = { checked: 'unchecked', unchecked: 'checked' };
    this.status = status[this.status];
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
    return true;
  }
  findTask(taskId) {
    const isRequestedTask = task => task.taskId === taskId;
    return this.tasks.find(isRequestedTask);
  }
  save(taskName) {
    const taskId = this.generateTaskId();
    return this.add(new Task(taskId, taskName, 'unchecked'));
  }
  editTask(taskId, editedTask) {
    const task = this.findTask(taskId);
    task.taskName = editedTask;
    return true;
  }
  toggleTaskStatus(taskId) {
    const task = this.findTask(taskId);
    if (task) {
      task.toggleStatus();
      return true;
    }
    return false;
  }
  deleteTask(id) {
    const noOfTasks = 1;
    const unsuccessful = -1;
    const index = this.tasks.findIndex(task => task.taskId === id);
    if (index !== unsuccessful) {
      this.tasks.splice(index, noOfTasks);
      return true;
    }
    return false;
  }
  update(title, tasks) {
    this.title = title;
    const updateTask = ({ taskId, task }) => {
      if (taskId) {
        return this.editTask(taskId, task);
      }
      return this.save(task);
    };
    tasks.forEach(updateTask);
    return true;
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
    return true;
  }
  findTodo(todoId) {
    const isRequestedTodo = todo => todo.id === todoId;
    return this.todos.find(isRequestedTodo);
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
    return this.add(newTodo);
  }
  toggleTaskStatus(taskId) {
    const todoId = this.extractTodoId(taskId);
    const todo = this.findTodo(todoId);
    if (todo) {
      return todo.toggleTaskStatus(taskId);
    }
    return false;
  }
  deleteTask(taskId) {
    const todoId = this.extractTodoId(taskId);
    const todo = this.findTodo(todoId);
    if (todo) {
      return todo.deleteTask(taskId);
    }
    return false;
  }
  deleteTodo(todoId) {
    const noOfTodos = 1;
    const unsuccessful = -1;
    const index = this.todos.findIndex(todo => todo.id === todoId);
    if (index !== unsuccessful) {
      this.todos.splice(index, noOfTodos);
      return true;
    }
    return false;
  }
  updateTodo(title, tasks, todoId) {
    const todo = this.findTodo(`${todoId}`);
    if (todo) {
      return todo.update(title, tasks);
    }
    return false;
  }
  toJSON() {
    return JSON.stringify(this.todos);
  }
  static load(content) {
    const allTodos = JSON.parse(content || '[]').reverse();
    const todos = new TodoList();
    allTodos.forEach(oldTodo => {
      todos.add(Todo.load(oldTodo));
    });
    return todos;
  }
}

module.exports = { TodoList };
