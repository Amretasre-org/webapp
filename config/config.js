require('dotenv').config();

console.log("Host: ", process.env.HOST)

module.exports = {
    HOST: process.env.HOST,
    USER: process.env.MYSQLUSER || "root",
    PASSWORD: process.env.PASSWORD,
    DB: "Assignments_Demo_DB",
    dialect: "mysql",
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  };