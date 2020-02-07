let id = new Date().getTime();

const generateId = function() {
  return id++;
};

createTasks = function(tasks) {
  return tasks.map(task => new Task(task));
};

class Task {
  constructor(task) {
    this.taskId = generateId();
    this.taskName = task;
    this.status = false;
  }
}

class Todo {
  constructor(title, tasks) {
    this.id = generateId();
    this.title = title;
    this.tasks = createTasks(tasks);
  }
}

module.exports = { Todo };
