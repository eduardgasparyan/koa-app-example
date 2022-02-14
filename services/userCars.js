const sequelize = require('../models');
const randomUUID = require('uuid');

exports.addCar = async ({ bodyParsed, params }) => {
  const databaseCarCheck = await sequelize.Cars.findOne({
    where: {
      UserId: params.id,
      car: bodyParsed.car,
    },
  });
  if (databaseCarCheck === null) {
    const carData = {
      UserId: params.id,
      car_id: randomUUID(),
      car: bodyParsed.car,
    };
    await sequelize.Cars.create(carData);
  } else throw new Error('Car already exists');
};

exports.userCars = async ({ params }) => {
  return sequelize.Cars.findAll({
    where: { UserId: params.id },
    attributes: ['car'],
  });
};

exports.deleteCar = async ({ params }) => {
  if (
    !(await sequelize.Cars.destroy({
      where: { UserId: params.id, car_id: params.car_id },
      force: true,
    }))
  )
    throw new Error('Car not found');
};

exports.changeCar = async ({ params, bodyParsed }) => {
  const carInDatabase = await sequelize.Cars.findByPk(params.car_id);
  if (!carInDatabase) throw new Error('Car not found');
  carInDatabase.car = bodyParsed.car;
  carInDatabase.save();
};
