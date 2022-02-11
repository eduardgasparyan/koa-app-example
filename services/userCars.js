const sequelize = require('../models');

exports.addingCar = async data => {
  const user = await sequelize.User.findOne({
    where: {
      username: data.username.username,
    },
  });
  const databaseCarCheck = await sequelize.car.findOne({
    where: {
      car: data.bodyParsed.car,
    },
  });
  if (databaseCarCheck !== null) {
    if (user.id !== databaseCarCheck.car_id) {
      const carData = {
        car_id: user.id,
        car: data.bodyParsed.car,
      };
      await sequelize.car.create(carData);
    } else throw new Error('Car already exists');
  } else {
    const carData = {
      car_id: user.id,
      car: data.bodyParsed.car,
    };
    await sequelize.car.create(carData);
    return carData.car;
  }
};

exports.userCars = async data => {
  const user = await sequelize.User.findOne({
    where: { username: data.username },
  });
  const carsFromDatabase = await sequelize.car.findAll({
    where: { car_id: user.id },
    attributes: ['car'],
  });
  return carsFromDatabase;
};

exports.deleteCar = async data => {
  const user = await sequelize.User.findOne({
    where: { username: data.username.username },
  });
  const carCheck = await sequelize.car.findOne({
    where: { car_id: user.id, car: data.carName.car },
  });
  if (!carCheck) throw new Error('Car not found');
  await carCheck.destroy({ force: true });
};

exports.changeCar = async data => {
  const user = await sequelize.User.findOne({
    where: { username: data.username.username },
  });
  const carCheck = await sequelize.car.findOne({
    where: { car_id: user.id, car: data.carName.carInDatabase },
  });
  if (!carCheck) throw new Error('Car not found');
  carCheck.car = data.carName.changeCar;
  carCheck.save();
};
