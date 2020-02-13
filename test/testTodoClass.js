'use strict';
const assert = require('chai').assert;
const { TodoList, Todo, Task } = require('../lib/todoClass');

describe ('Task', () => {
  describe ('toggleStatus', () => {
    it('Should set status as checked if it is unchecked', () => {
      const task = new Task('1234', 'Task1', '');
      task.toggleStatus();
      assert.strictEqual(task.status, 'checked');
    });
    it('Should set status as unchecked if it is checked', () => {
      const task = new Task('1234', 'Task1', 'checked');
      task.toggleStatus();
      assert.strictEqual(task.status, '');
    });
  });
  
});
