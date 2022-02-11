const sequelize = require('../models');

async function checkProperties(data, user) {
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

exports.getOne = async data => {
  const user = await sequelize.User.findOne({
    where: { username: data.username },
  });
  return user;
};

exports.deleteOne = async param => {
  await sequelize.User.destroy({
    where: { username: param },
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
  user = await checkProperties(data, user);
  user.updatedAt = new Date();
  user.updatedAt.getDate();
  await user.save();
  return user;
};
