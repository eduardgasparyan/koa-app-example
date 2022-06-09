module.exports = (sequelize, DataTypes) => {
  const Cars = sequelize.define('Cars', {
    car_id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    car: {
      type: DataTypes.STRING,
    },
  });
  Cars.associate = function(models) {
    Cars.belongsTo(models.Users, { onDelete: 'CASCADE' });
  };
  return Cars;
};
