const { TodoList } = require('./todoClass');

class User {
  constructor(id, fullName, name, password, mail, data) {
    this.id = id;
    this.fullName = fullName;
    this.name = name;
    this.password = password;
    this.mail = mail;
    this.data = TodoList.load(data);
  }
  getData() {
    return this.data;
  }
  static load(userContent) {
    const { id, fullName, name, password, mail, data } = userContent;
    const user = new User(id, fullName, name, password, mail, data);
    return user;
  }
}

class UserList {
  constructor() {
    this.users = [];
  }
  generateUserId() {
    return `${new Date().getTime()}`;
  }
  isAuthorized(userName, password) {
    return this.users.some(
      user => user.name === userName && user.password === password
    );
  }
  getUsers() {
    return this.users;
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
  add(user) {
    this.users.push(user);
  }
  save({ fullName, mail, userName, password }) {
    const userId = this.generateUserId();
    const user = new User(userId, fullName, userName, password, mail, {
      todos: []
    });
    this.add(user);
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
