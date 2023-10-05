const dbConfig = require("../config/config.js");

const { Sequelize, DataTypes }  = require("sequelize");

const userController = require("../controllers/userController");

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
});

const db = {};

db.Sequelize = Sequelize; // constructor
db.sequelize = sequelize; // the instance of Sequelize

db.users = require("./userModel")(sequelize, DataTypes);
db.assignments = require("./assignmentModel")(sequelize, DataTypes);

db.sequelize.authenticate()
.then(() => {
  console.log("Connected to DB");
  db.sequelize.sync({force: false});
})
.then(async () => {
  console.log("Adding users to DB");
  await userController.addUser(db);
})
.catch((err) => {
  console.log("Error", err);
})

module.exports = db;