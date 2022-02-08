require('dotenv').config();

module.exports = {
  development: {
    username: 'postgres',
    password: 'root',
    host: '127.0.0.1',
    port: '5432',
    dbName: 'users_db',
    dialect: 'postgres',
  },
};
