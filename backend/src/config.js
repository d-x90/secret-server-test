require('dotenv').config();

module.exports = {
  SERVER_PORT: process.env.SERVER_PORT || 8080,
  DB_CONNECTION_STRING: process.env.DB_CONNECTION_STRING,
  SIGN_KEY: process.env.SIGN_KEY,
};
