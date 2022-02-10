module.exports = (sequelize, DataTypes) => {
  const tokenTable = sequelize.define('tokenTable', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    token: {
      type: DataTypes.STRING(1234),
    },
  });

  return tokenTable;
};
