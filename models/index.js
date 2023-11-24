const dbConfig = require("../config/config.js");

const { Sequelize, DataTypes }  = require("sequelize");

const acctController = require("../controllers/accountController");

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

db.accounts = require("./accountModel")(sequelize, DataTypes);
db.assignments = require("./assignmentModel")(sequelize, DataTypes);
db.submissions = require("./submissionModel")(sequelize, DataTypes);

db.assignments.belongsTo(db.accounts, {
  foreignKey: 'userId',
  as:'account',
  targetKey: 'id'
})

db.submissions.belongsTo(db.assignments, {
  foreignKey: 'assignment_id',
  as: 'assignment',
  targetKey: 'id'
});

db.submissions.belongsTo(db.accounts, {
  foreignKey: 'user_id',
  as: 'account',
  targetKey: 'id'
});

db.sequelize.authenticate()
.then(() => {
  console.log("Connected to DB");
  return db.sequelize.sync({force: false});
})
.then(async () => {
  console.log("Adding users to DB");
  await acctController.userCreation(db);
})
.catch((err) => {
  console.log("Error", err);
})

module.exports = db;