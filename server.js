const express = require("express");
const cors = require("cors");
const db = require("./models");
const fs = require("fs");
// import bcryptingPassword from "../utils/bcrypting";
const { bcryptingPassword } = require("./utils/bcrypting");

const userRoutes = require("./routes/userRoutes");
const healthRoutes = require("./routes/healthRoutes");
const assignmentRoutes = require("./routes/assignmentRoutes");

const authorization = require("./middleware/authorization");

global.__basedir = __dirname;
global.auth_token = "";
const app = express();

var corsOptions = {
  origin: "http://localhost:8081"
};

app.use(cors(corsOptions));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(authorization);

// app.use("/v1/users", userRoutes);

app.use("/v1/", healthRoutes);

app.use("/v1/assignments", assignmentRoutes);

const addUser = async () => {
  let path = __basedir + "/opt/users.csv";
  let usersArr = [];
  const fileContent = fs.readFileSync(path, 'utf8');
  const lines = fileContent.split("\n");
  const datLines = lines.slice(1).filter(line => line.trim() !== '');

  datLines.forEach((line) => {
    const columns = line.split(",");
    const hashedPassword = bcryptingPassword(columns[3]);
    const user = {
      id: Buffer.from(`${columns[2]}:${columns[3]}`, 'utf8').toString('base64'),
      firstName: columns[0],
      lastName: columns[1],
      email: columns[2],
      password: hashedPassword, // Assign the hashed password here
    };
    usersArr.push(user);
  });

  try {
    if (usersArr.length != 0) {
      await db.users.bulkCreate(usersArr);
    }
  } catch (e) {
    console.log(e);
  }
}

db.sequelize.sync({ force: true })
  .then(async () => {
    console.log("DB is synced");
    await addUser();
    const PORT = process.env.PORT || 8080;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}.`);
    });
  }).catch(err => {
    console.log(err)
  });


module.exports = app;