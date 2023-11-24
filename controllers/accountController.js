const { bcryptingPassword } = require("../utils/bcrypting");
require('dotenv').config();
const fs = require("fs");

const userCreation = async (db) => {
    let path = __basedir + "/opt/users.csv";
    let acctssArr = [];
    const fileContent = fs.readFileSync(path, 'utf8');
    const lines = fileContent.split("\n");
    const datLines = lines.slice(1).filter(line => line.trim() !== '');
  
    datLines.forEach((line) => {
      const columns = line.split(",");
      const hashedPassword = bcryptingPassword(columns[3]);
      const account = {
        id: Buffer.from(`${columns[2]}:${columns[3]}`, 'utf8').toString('base64'),
        first_name: columns[0],
        last_name: columns[1],
        email: columns[2],
        password: hashedPassword,
      };
      acctssArr.push(account);
    });
  
    try {
      if (acctssArr.length != 0) {
        await db.accounts.bulkCreate(acctssArr);
      }
    } catch (e) {
      console.error(e);
    }
  }

module.exports = {
    userCreation
};