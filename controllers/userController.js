require('dotenv').config();
const fs = require("fs");

const { bcryptingPassword } = require("../utils/bcrypting");

const addUser = async (db) => {
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

module.exports = {
    addUser
};