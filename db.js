const randomUUID = require('uuid');
const db = {
  users: [
    {
      username: 'Marco',
      password: 'Thomson',
      email: 'test@gmail.com',
      id: '61a6ab02-84be-11ec-a8a3-0242ac120002',
    },
    {
      username: 'Kate',
      password: 'Jackson',
      email: 'asfagwa@gmail.com',
      id: '8f2475d2-84be-11ec-a8a3-0242ac120002',
    },
    {
      username: 'Phil',
      password: 'Gisbert',
      email: 'asdgrgsasd@gmail.com',
      id: '85d82e38-84be-11ec-a8a3-0242ac120002',
    },
  ],
};
exports.getAll = async ctx => {
  return db;
};

exports.getOne = param => {
  const userID = Number(param);
  const user = db.users.find(user => user.id === userID);
  return user;
};

exports.createOne = async (username, password, email) => {
  const id = randomUUID();
  const newUser = {
    username,
    password,
    email,
    id,
  };
  db.users.push(newUser);
  const createdUser = db.users.find(user => user.id === id);
  return createdUser;
};

exports.deleteOne = param => {
  const userID = Number(param);
  delete db.users[userID];
  return db;
};
