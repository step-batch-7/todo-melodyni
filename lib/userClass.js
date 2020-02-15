const { TodoList } = require('./todoClass');

class User {
  constructor(id, name, password, data) {
    this.id = id;
    this.name = name;
    this.password = password;
    this.data = data;
  }
  getData() {
    return this.data;
  }
  static load(userContent) {
    const { id, name, password, data } = userContent;
    const todoLists = TodoList.load(data);
    const user = new User(id, name, password, todoLists);
    return user;
  }
}

class UserList {
  constructor() {
    this.users = [];
  }
  isAuthorized(userName, password) {
    return this.users.some(
      user => user.name === userName && user.password === password
    );
  }
  findUser(userName) {
    return this.users.find(user => user.name === userName);
  }
  getData(userName) {
    const user = this.findUser(userName);
    if (user) {
      return user.getData();
    }
    return new TodoList();
  }
  toJSON() {
    return JSON.stringify(this.users);
  }
  static load(usersContent) {
    const usersData = JSON.parse(usersContent);
    const userList = new UserList();
    userList.users = usersData.map(user => User.load(user));
    return userList;
  }
}

module.exports = { UserList };
