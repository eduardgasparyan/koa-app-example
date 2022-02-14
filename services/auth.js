const jwt = require('jsonwebtoken');
const sequelize = require('../models');
const randomUUID = require('uuid');
const bcrypt = require('bcrypt');
const accessSecretKey = process.env.ACCESS_TOKEN_SECRET;
const refreshSecretKey = process.env.REFRESH_TOKEN_SECRET;

const generateAccessToken = async accessTokenData => {
  return jwt.sign({ accessTokenData }, accessSecretKey, { expiresIn: '30m' });
};

const generateRefreshToken = async refreshTokenData => {
  return jwt.sign({ refreshTokenData }, refreshSecretKey, { expiresIn: '30d' });
};

exports.createOne = async ({ bodyParsed }) => {
  const candidate = await sequelize.Users.findOne({
    where: {
      username: bodyParsed.username,
    },
  });
  if (candidate !== null) {
    throw new Error(`Candidate with this email already registered!`);
  }
  const pass = await bcrypt.hash(bodyParsed.password, 10);
  const newUser = {
    username: bodyParsed.username,
    password: pass,
    email: bodyParsed.email,
    id: randomUUID(),
  };
  try {
    await sequelize.Users.create(newUser);
    return sequelize.Users.findByPk(newUser.id);
  } catch (err) {
    console.log(err);
  }
};

exports.login = async ({ bodyParsed }) => {
  const user = await sequelize.Users.findOne({
    where: {
      username: bodyParsed.username,
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
    UserId: user.id,
    expiresIn: accessExpirationTime,
  };
  const refreshTokenData = {
    UserId: user.id,
    expiresIn: refreshExpirationTime,
  };
  const hashedPassword = user.password;
  if (await bcrypt.compare(bodyParsed.password, hashedPassword)) {
    const tokens = {
      refreshToken: await generateRefreshToken(refreshTokenData),
      accessToken: await generateAccessToken(accessTokenData),
    };
    const token = {
      UserId: user.id,
      token_id: randomUUID(),
      token: tokens.refreshToken,
    };
    await sequelize.Tokens.create(token);
    return tokens;
  } else throw new Error('Invalid username or password');
};

exports.generateNewAccessToken = async ({ refreshToken, params }) => {
  const decoded = await jwt.verify(refreshToken, refreshSecretKey);
  if (params.id === decoded.refreshTokenData.UserId) {
    const date = new Date();
    const accessExpirationTime = new Date();
    date.setMinutes(date.getMinutes());
    accessExpirationTime.setMinutes(accessExpirationTime.getMinutes() + 30);
    const accessTokenData = {
      UserId: params.id,
      expiresIn: accessExpirationTime,
    };
    const newAccessToken = await generateAccessToken(accessTokenData);
    return newAccessToken;
  } else throw new Error('Invalid Refresh Token');
};

exports.logout = async ({ params }) => {
  const user = await sequelize.Users.findByPk(params.id);
  await sequelize.Tokens.destroy({
    where: { UserId: user.id },
    force: true,
  });
};
// module.exports = ;
