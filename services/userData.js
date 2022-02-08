const randomUUID = require('uuid');
const sequelize = require('../../models/index');
const bcrypt = require('bcrypt');
const migration = require('../../migrations/20220203125448-create-user');

exports.getAll = async ctx => {
  return sequelize.User.findAll();
};

exports.getOne = async username => {
  const user = await sequelize.User.findOne({
    where: { username: username },
  });
  return user;
};

exports.createOne = async (username, password, email) => {
  const id = randomUUID();
  const salt = await bcrypt.genSalt(10);
  const pass = await bcrypt.hash(password, salt);
  const newUser = {
    username: username,
    password: pass,
    salt: salt,
    email: email,
    id: id,
  };
  try {
    await sequelize.User.create(newUser);
    const createdUser = sequelize.User.findByPk(id);
    return createdUser;
  } catch (err) {
    console.log(err);
  }
};

exports.login = async (username, password) => {
  const user = await sequelize.User.findOne({
    where: {
      username: username,
    },
  });
  const hashedPassword = user.password;
  const newHashedPassword = await bcrypt.hash(password, user.salt);
  if (hashedPassword === newHashedPassword) {
    return console.log('logged');
  } else return console.log('false');
};

exports.deleteOne = async param => {
  await sequelize.User.destroy({
    where: { id: param },
    force: true,
  });
  return sequelize.User.findAll();
};

exports.updateAge = async (username, age) => {
  const user = await sequelize.User.findOne({
    where: {
      username: username,
    },
  });
  user.age = age;
  await sequelize.User.destroy({
    where: { id: user.id },
  });
  await sequelize.User.create(user);
  return console.log(
    await sequelize.User.findOne({
      where: { id: user.id },
    }),
  );
};

exports.addAgeColumn = async () => {
  const users = await sequelize.User.findAll();
  await migration.up(users);
  return users;
};
