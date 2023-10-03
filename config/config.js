module.exports = {
    HOST: "localhost",
    USER: "root",
    PASSWORD: `${process.env.password}`,
    DB: "Assignments_Demo_DB",
    dialect: "mysql",
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  };