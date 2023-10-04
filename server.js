const express = require("express");
const cors = require("cors");
const db = require("./models");
const userController = require("./controllers/userController")

const healthRoutes = require("./routes/healthRoutes");
const assignmentRoutes = require("./routes/assignmentRoutes");

const authorization = require("./middleware/authorization");

global.__basedir = __dirname;
const app = express();

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(authorization);

app.use("/v1/", healthRoutes);

app.use("/v1/assignments", assignmentRoutes);

db.sequelize.sync({ force: true })
  .then(async () => {
    console.log("DB is synced");
    await userController.addUser(db);
    const PORT = process.env.PORT || 8080;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}.`);
    });
  }).catch(err => {
    console.log(err)
  });


module.exports = app;