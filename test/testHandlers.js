const request = require('supertest');
const { app } = require('../lib/handler');

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
      .expect('Content-Type', 'text/plain')
      .expect(/title/);
  });
});

describe('METHOD not allowed', () => {
  it('should return 405 if the requested method is not allowed', done => {
    request(app.respond.bind(app))
      .put('/guestBook.html')
      .expect(405, done);
  });
});
