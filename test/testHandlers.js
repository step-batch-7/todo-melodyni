const { truncateSync } = require('fs');
const request = require('supertest');
const { app } = require('../lib/handler');
const config = require('../config');

describe('GET', () => {
  it('should get the homepage(index.html) for path /', done => {
    request(app.respond.bind(app))
      .get('/')
      .set('Accept', '*/*')
      .expect(200)
      .expect('Content-Type', 'text/html', done);
  });

  it('should get the file if requested path is valid', done => {
    request(app.respond.bind(app))
      .get('/index.html')
      .set('Accept', '*/*')
      .expect(200)
      .expect('Content-Type', 'text/html', done);
  });

  it('should return 404 status code for a non existing url', done => {
    request(app.respond.bind(app))
      .get('/badPage')
      .set('Accept', '*/*')
      .expect(404, done);
  });

  it('should give all todo data from database for request /oldTodos', done => {
    request(app.respond.bind(app))
      .get('/oldTodos')
      .set('Accept', '*/*')
      .expect(200, done)
      .expect('Content-Type', 'text/plain');
  });

  it('should give all tasks for the given id in GET url', done => {
    request(app.respond.bind(app))
      .get('/fetchTasks?id=todo_1')
      .set('Accept', '*/*')
      .expect(200, done)
      .expect('Content-Type', 'text/plain');
  });
});

describe('POST', () => {
  it('should handle post request and save new Todo to resources', done => {
    const newTodo = {
      title: 'newTodo',
      tasks: ['task1', 'task2', 'task3']
    };
    request(app.respond.bind(app))
      .post('/postNewTodos')
      .send(newTodo)
      .expect(200, done);
  });
  after(() => {
    truncateSync(config.DATABASE);
  });
});

describe('METHOD not allowed', () => {
  it('should return 405 if the requested method is not allowed', done => {
    request(app.respond.bind(app))
      .put('/guestBook.html')
      .expect(405, done);
  });
});
