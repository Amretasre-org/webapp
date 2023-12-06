const express = require("express");
const cors = require("cors");
const db = require("./models");
require('dotenv').config();

const healthRoutes = require("./routes/healthRoutes");
const assignmentRoutes = require("./routes/assignmentRoutes");

global.__basedir = __dirname;
const app = express();

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use("/", healthRoutes);

app.use("/v3/assignments", assignmentRoutes);

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
module.exports = app;
