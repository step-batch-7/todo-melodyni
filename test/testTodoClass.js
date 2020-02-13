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
  describe('findIndex', () => {
    it('Should find the index of the given taskId if exists', () => {
      const todo = new Todo('1234', 'TITLE', [{ taskId: '1234_1' }]);
      assert.strictEqual(todo.findIndex('1234_1'), 0);
    });
    it('Should find the index of the given taskId if exists', () => {
      const todo = new Todo('1234', 'TITLE', [{ taskId: '1234_1' }]);
      assert.strictEqual(todo.findIndex('1234_5'), -1);
    });
  });
  describe('static load', () => {
    it('Should load and make given todo the instance of Todo class', () => {
      const todo = { id: '1234', title: 'TITLE', tasks: [] };
      const actual = Todo.load(todo);
      assert.isTrue(actual instanceof Todo);
    });
  });
});
