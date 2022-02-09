'use strict';
const { sequelize, Sequelize } = require('../../models');
const queryInterface = sequelize.getQueryInterface();
module.exports = {
  up: async () => {
    return queryInterface.addColumn('Users', 'age', {
      type: Sequelize.STRING,
    });
  },
  down: async () => {
    return queryInterface.removeColumn('Users', 'age');
  },
};
