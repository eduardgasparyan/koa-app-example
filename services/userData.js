const sequelize = require('../models');

async function updateProperties(data, user) {
  for (let key in data) {
    if (data[key] !== undefined) {
      user[key] = data[key];
    }
  }
  return user;
}

exports.getAll = async ctx => {
  return sequelize.Users.findAll();
};

exports.getOne = async ({ params }) => {
  console.log(params);
  const user = await sequelize.Users.findByPk(params.id);
  return user;
};

exports.deleteOne = async ({ params }) => {
  const user = await sequelize.Users.findByPk(params.id);
  await sequelize.Users.destroy({
    where: { username: user.username },
    force: true,
  });
};

exports.update = async ({ bodyParsed, params }) => {
  let user = await sequelize.Users.findByPk(params.id);
  user = await updateProperties(bodyParsed, user);
  user.updatedAt = new Date();
  user.updatedAt.getDate();
  await user.save();
  return user;
};
