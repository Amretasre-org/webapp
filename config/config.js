require('dotenv').config();
const log4js = require('../log4js-config');
const logger = log4js.getLogger();

console.log("Host for DB: ", process.env.HOST)
logger.info("Host for DB: ", process.env.HOST)

module.exports = {
    HOST: process.env.HOST || "localhost",
    USER: process.env.MYSQLUSER || "root",
    PASSWORD: process.env.PASSWORD || "amre1999",
    DB: "Assignments_Demo_DB",
    dialect: "mysql",
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  };