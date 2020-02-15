class User {
  constructor(id, name, password, data) {
    this.id = id;
    this.name = name;
    this.password = password;
    this.data = data;
  }
  static load(userContent) {
    const { id, name, password, data } = userContent;
    const user = new User(id, name, password, data);
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
  static load(usersContent) {
    const usersData = JSON.parse(usersContent);
    const userList = new UserList();
    userList.users = usersData.map(user => User.load(user));
    return userList;
  }
}

module.exports = { UserList };
