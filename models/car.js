module.exports = (sequelize, DataTypes) => {
  const car = sequelize.define('car', {
    car_id: {
      type: DataTypes.STRING,
    },
    car: {
      type: DataTypes.STRING,
    },
  });

  return car;
};
