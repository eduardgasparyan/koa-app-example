const jwt = require('jsonwebtoken');
const sequelize = require('../models');
const randomUUID = require('uuid');
const bcrypt = require('bcrypt');
const accessSecretKey = process.env.ACCESS_TOKEN_SECRET;
const refreshSecretKey = process.env.REFRESH_TOKEN_SECRET;
console.log({ table: sequelize.User });

const generateAccessToken = async accessTokenData => {
  return jwt.sign({ accessTokenData }, accessSecretKey, { expiresIn: '30m' });
};

const generateRefreshToken = async refreshTokenData => {
  return jwt.sign({ refreshTokenData }, refreshSecretKey, { expiresIn: '30d' });
};

exports.createOne = async data => {
  const candidate = await sequelize.User.findOne({
    where: {
      username: data.username,
    },
  });
  if (candidate !== null) {
    throw new Error(`Candidate with this email already registered!`);
  }
  const id = randomUUID();
  const pass = await bcrypt.hash(data.password, 10);
  const newUser = {
    username: data.username,
    password: pass,
    email: data.email,
    id: id,
  };
  try {
    await sequelize.User.create(newUser);
    const createdUser = await sequelize.User.findByPk(id);
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
  const date = new Date();
  const accessExpirationTime = new Date();
  const refreshExpirationTime = new Date();
  date.setMinutes(date.getMinutes());
  refreshExpirationTime.setMinutes(
    refreshExpirationTime.getMinutes() + 30 * 24 * 60,
  );
  accessExpirationTime.setMinutes(accessExpirationTime.getMinutes() + 30);
  const accessTokenData = {
    username: user.username,
    expiresIn: accessExpirationTime,
  };
  const refreshTokenData = {
    username: user.username,
    expiresIn: refreshExpirationTime,
  };
  const hashedPassword = user.password;
  if (await bcrypt.compare(data.password, hashedPassword)) {
    const tokens = {
      refreshToken: await generateRefreshToken(refreshTokenData),
      accessToken: await generateAccessToken(accessTokenData),
    };
    const token = {
      id: user.id,
      token: tokens.refreshToken,
    };
    await sequelize.tokenTable.create(token);
    return tokens;
  } else throw new Error('Invalid username or password');
};

exports.verifyToken = async (token, data) => {
  if (!token) {
    throw new Error('A token is required for authentication');
  }
  try {
    const decoded = await jwt.verify(token, accessSecretKey);
    if (decoded.accessTokenData.username === data.username) return true;
  } catch (err) {
    throw new Error('Invalid Token');
  }
};

exports.generateNewAccessToken = async data => {
  const decoded = await jwt.verify(data.authorization, refreshSecretKey);
  const user = await sequelize.User.findOne({
    where: { username: decoded.refreshTokenData.username },
  });
  const userToken = await sequelize.tokenTable.findByPk(user.id);
  try {
    if (data.authorization === userToken.token) {
      const date = new Date();
      const accessExpirationTime = new Date();
      date.setMinutes(date.getMinutes());
      accessExpirationTime.setMinutes(accessExpirationTime.getMinutes() + 30);
      const accessTokenData = {
        username: user.username,
        email: user.email,
        date: date,
        expiresIn: accessExpirationTime,
      };
      return generateAccessToken(accessTokenData);
    }
  } catch (err) {
    throw new Error('Invalid Token');
  }
};

exports.logout = async data => {
  const user = await sequelize.User.findOne({
    where: {
      username: data.username,
    },
  });
  await sequelize.tokenTable.destroy({
    where: { id: user.id },
    force: true,
  });
};
// module.exports = ;
