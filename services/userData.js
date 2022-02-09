const randomUUID = require('uuid');
const sequelize = require('../models');
const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// const tokenKey = toString(process.env.TOKEN_SECRET);
// const generateAccessToken = async username => {
//   return jwt.sign(username, process.env.TOKEN_SECRET, { expiresIn: '1800s' });
// };

function checkProperties(data, user) {
  for (let key in data) {
    if (data[key] !== undefined) {
      user[key] = data[key];
    }
  }
  return user;
}

exports.getAll = async ctx => {
  return sequelize.User.findAll();
};

exports.getOne = async username => {
  const user = await sequelize.User.findOne({
    where: { username: username },
  });
  return user;
};

exports.createOne = async data => {
  // const candidate = sequelize.User.findOne(username);
  // if (candidate) {
  //   throw new Error(`Candidate with this email already registrated!`);
  // }
  const id = randomUUID();
  const salt = await bcrypt.genSalt(10);
  const pass = await bcrypt.hash(data.password, salt);
  // const generatedToken = await generateAccessToken(
  //   username,
  //   process.env.TOKEN_SECRET,
  //   { expiersIn: '1800s' },
  // );
  const newUser = {
    username: data.username,
    password: pass,
    email: data.email,
    id: id,
    salt: salt,
    // token: generatedToken,
  };
  try {
    await sequelize.User.create(newUser);
    const createdUser = sequelize.User.findByPk(id);
    return createdUser;
  } catch (err) {
    console.log(err);
  }
};

exports.login = async data => {
  const user = await sequelize.User.findOne({
    where: {
      username: data.username,
    },
  });
  const hashedPassword = user.password;
  const newHashedPassword = await bcrypt.hash(data.password, user.salt);
  if (hashedPassword === newHashedPassword) {
    return user;
  } else throw new Error('Invalid username or password');
};

exports.deleteOne = async param => {
  await sequelize.User.destroy({
    where: { id: param },
    force: true,
  });
  return sequelize.User.findAll();
};

exports.update = async (username, data) => {
  let user = await sequelize.User.findOne({
    where: {
      username: username,
    },
  });
  user = checkProperties(data, user);
  await user.save();
  return user;
};
