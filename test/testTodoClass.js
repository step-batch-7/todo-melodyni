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
  describe('static load', () => {
    it('Should load given list as class instance', () => {
      const list = [
        {
          id: '1581336711285',
          title: 'newTodo',
          tasks: [
            {
              taskId: '1581336711285_0',
              taskName: 'task1',
              status: 'unchecked'
            }
          ]
        }
      ];
      const actual = TodoList.load(JSON.stringify(list));
      assert.isTrue(actual instanceof TodoList);
    });
    it('Should give instance of todoList for empty content', () => {
      const actual = TodoList.load('');
      assert.isTrue(actual instanceof TodoList);
    });
  });
  describe('toJSON', () => {
    it('Should give JSON stringified todos', () => {
      const todoList = new TodoList();
      todoList.add({ id: '1234' });
      assert.strictEqual(todoList.toJSON(), '[{"id":"1234"}]');
    });
  });
  describe('save', () => {
    it('Should save given title and tasks as new Todo in todoList', () => {
      const todoList = new TodoList();
      const actual = todoList.save('TITLE', ['task1']);
      assert.strictEqual(actual, true);
    });
  });
});
