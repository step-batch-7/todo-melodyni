class App {
  constructor() {
    this.routes = [];
  }

  get(path, handler) {
    this.routes.push({ path, handler, method: 'GET' });
  }

  post(path, handler) {
    this.routes.push({ path, handler, method: 'POST' });
  }

  delete(path, handler) {
    this.routes.push({ path, handler, method: 'DELETE' });
  }

  use(middleware) {
    this.routes.push({ handler: middleware });
  }

  respond(request, res) {
    const handlers = this.routes.filter(route => matchRoute(route, request));
    const performNext = function() {
      const router = handlers.shift();
      router.handler(request, res, performNext);
    };
    performNext();
  }
}

const matchRoute = function(route, request) {
  if (route.method) {
    return route.method === request.method && request.url.match(route.path);
  }
  return true;
};

module.exports = { App };
