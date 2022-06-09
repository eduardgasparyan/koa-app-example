module.exports = (sequelize, DataTypes) => {
  const Tokens = sequelize.define('Tokens', {
    token_id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    token: {
      type: DataTypes.STRING(1234),
    },
  });

  Tokens.associate = function(models) {
    Tokens.belongsTo(models.Users, { onDelete: 'CASCADE' });
  };

  return Tokens;
};
