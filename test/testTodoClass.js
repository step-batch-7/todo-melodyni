'use strict';
const assert = require('chai').assert;
const { TodoList, Todo, Task } = require('../lib/todoClass');

describe('Task', () => {
  describe('toggleStatus', () => {
    it('Should set status as checked if it is unchecked', () => {
      const task = new Task('1234', 'Task1', 'unchecked');
      task.toggleStatus();
      assert.strictEqual(task.status, 'checked');
    });
    it('Should set status as unchecked if it is checked', () => {
      const task = new Task('1234', 'Task1', 'checked');
      task.toggleStatus();
      assert.strictEqual(task.status, 'unchecked');
    });
  });
});

describe('Todo', () => {
  describe('generateTaskId', () => {
    it('Should generate task id as 1 for new Task', () => {
      const todo = new Todo('1234', 'TITLE', []);
      assert.strictEqual(todo.generateTaskId(), '1234_1');
    });
    it('Should generate new TaskId by incrementing the last taskId', () => {
      const todo = new Todo('1234', 'TITLE', [{ taskId: '1234_1' }]);
      assert.strictEqual(todo.generateTaskId(), '1234_2');
    });
  });
  describe('findTask', () => {
    it('Should find task of given TaskId if exists', () => {
      const todo = new Todo('1234', 'TITLE', [{ taskId: '1234_1' }]);
      assert.deepStrictEqual(todo.findTask('1234_1'), { taskId: '1234_1' });
    });
    it('Should find task of given TaskId if exists', () => {
      const todo = new Todo('1234', 'TITLE', [{ taskId: '1234_1' }]);
      assert.isUndefined(todo.findTask('1234_2'));
    });
  });
  describe('static load', () => {
    it('Should load and make given todo the instance of Todo class', () => {
      const todo = { id: '1234', title: 'TITLE', tasks: [] };
      const actual = Todo.load(todo);
      assert.isTrue(actual instanceof Todo);
    });
  });
  describe('toggleTaskStatus', () => {
    it('Should return true if it toggles the status', () => {
      const task = new Task('1234_1', 'task1', 'unchecked');
      const todo = new Todo('1234', 'TITLE', [task]);
      assert.isTrue(todo.toggleTaskStatus('1234_1'));
    });
    it('Should return false if given task does not exists', () => {
      const task = new Task('1234_1', 'task1', 'unchecked');
      const todo = new Todo('1234', 'TITLE', [task]);
      assert.isFalse(todo.toggleTaskStatus('1234_5'));
    });
  });
});

describe('TodoList', () => {
  const list = [
    {
      id: '1234',
      title: 'newTodo',
      tasks: [
        {
          taskId: '1234_1',
          taskName: 'task1',
          status: 'unchecked'
        },
        {
          taskId: '1234_2',
          taskName: 'task2',
          status: 'unchecked'
        }
      ]
    }
  ];
  const todoList = TodoList.load(JSON.stringify(list));

  describe('static load', () => {
    it('Should load given list as class instance', () => {
      assert.isTrue(todoList instanceof TodoList);
    });
    it('Should give instance of todoList for empty content', () => {
      const todoList = TodoList.load('');
      assert.isTrue(todoList instanceof TodoList);
    });
  });

  describe('toJSON', () => {
    it('Should give JSON stringified todos', () => {
      assert.strictEqual(todoList.toJSON(), JSON.stringify(list));
    });
  });

  describe('save', () => {
    it('Should save given title and tasks as new Todo in todoList', () => {
      const actual = todoList.save('TITLE', ['task1']);
      assert.strictEqual(actual, true);
    });
  });

  describe('toggleTaskStatus', () => {
    it('Should give true if it toggles the task status successfully', () => {
      assert.isTrue(todoList.toggleTaskStatus('1234_1'));
    });
    it('Should give false given task does not exist', () => {
      assert.isFalse(todoList.toggleTaskStatus('1234_5'));
    });
    it('Should give false given todo does not exist', () => {
      assert.isFalse(todoList.toggleTaskStatus('1233_5'));
    });
  });

  describe('deleteTask', () => {
    it('Should give true if the given task exists', () => {
      assert.isTrue(todoList.deleteTask('1234_2'));
    });
    it('Should give false if given task does not exist', () => {
      assert.isFalse(todoList.deleteTask('1234_3'));
    });
    it('Should give false if given todo not exist', () => {
      assert.isFalse(todoList.deleteTask('1223_1'));
    });
  });
});
