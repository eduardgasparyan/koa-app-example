module.exports = (sequelize, DataTypes) => {
  const tokenTable = sequelize.define('tokenTable', {
    token_id: {
      type: DataTypes.STRING,
    },
    token: {
      type: DataTypes.STRING(1234),
    },
  });

  return tokenTable;
};
