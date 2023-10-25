require('dotenv').config();

module.exports = {
    HOST: process.env.HOST,
    USER: process.env.MYSQLUSER || "root",
    PASSWORD: process.env.PASSWORD || "root",
    DB: "Assignments_Demo_DB",
    dialect: "mysql",
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  };