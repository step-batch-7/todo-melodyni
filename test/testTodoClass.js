'use strict';
const assert = require('chai').assert;
const { TodoList } = require('../lib/todoClass');

describe('TodoList', () => {
  const list = {
    todos: [
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
      },
      {
        id: '12345',
        tasks: []
      }
    ]
  };
  const todoList = TodoList.load(list);

  describe('static load', () => {
    it('Should load given list as class instance', () => {
      assert.isTrue(todoList instanceof TodoList);
    });
    it('Should give instance of todoList for empty content', () => {
      const todoList = TodoList.load({ todos: [] });
      assert.isTrue(todoList instanceof TodoList);
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

  describe('deleteTodo', () => {
    it('Should give true if the given todo exists', () => {
      assert.isTrue(todoList.deleteTodo('12345'));
    });
    it('Should give false if given todo not exist', () => {
      assert.isFalse(todoList.deleteTodo('1223'));
    });
  });

  describe('updateTodo', () => {
    it('Should update the existing todo with given values and give true', () => {
      const tasks = [{ taskId: '1234_1', task: 'hello' }];
      assert.isTrue(todoList.updateTodo('Hello', tasks, 1234));
    });
    it('Should give false if given todo does not exist', () => {
      assert.isFalse(todoList.updateTodo('Hello', [], 123456));
    });
    it('Should save and give true if given task does not exist', () => {
      const tasks = [{ task: 'hello' }];
      assert.isTrue(todoList.updateTodo('Hello', tasks, 1234));
    });
  });
});
