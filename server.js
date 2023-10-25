const express = require("express");
const cors = require("cors");
const db = require("./models");
// const userController = require("./controllers/userController")
require('dotenv').config();

const healthRoutes = require("./routes/healthRoutes");
const assignmentRoutes = require("./routes/assignmentRoutes");

const authorization = require("./middleware/authorization");

global.__basedir = __dirname;
const app = express();

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use("/", healthRoutes);

app.use("/v1/assignments", assignmentRoutes);

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
module.exports = app;