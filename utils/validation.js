const sequelize = require('../db/config/sequelizeConfig');
const { Op } = require('sequelize');
const admin = require('../db/model/admin')(sequelize);
const chief = require('../db/model/chief')(sequelize);
const employee = require('../db/model/employee')(sequelize);
const technician = require('../db/model/technician')(sequelize);

const receive_repair = require('../db/model/receiveRepair')(sequelize);
const assignWork = require('../db/model/assignWork')(sequelize);
async function checkDuplicatesEmailPhone(email, phone) {
  // ตรวจสอบทุก Table โดยเก็บ table ลงใน Array
  const tables = [admin, chief, employee, technician];
  try {
    // วนloop ตามจำนวน table
    for (let table of tables) {
      let result = await table.findOne({
        where: {
            [Op.or]: [{ email: email },{ phone: phone }]}
      });
      if (result) return true; // Duplicate found
    }
    return false; // No duplicates
  } catch (error) {
    console.error('Error checking duplicates:', error);
    throw error;
  }
}

async function checkDuplicatesName(firstname, lastname) {
    // ตรวจสอบทุก Table โดยเก็บ table ลงใน Array
    const tables = [admin, chief, employee, technician];
    try {
      // วนloop ตามจำนวน table
      for (let table of tables) {
        let result = await table.findOne({
          where: {
              [Op.and]: [{ firstname: firstname },{ lastname: lastname }]}
        });
        if (result) return true; // Duplicate found
      }
      return false; // No duplicates
    } catch (error) {
      console.error('Error checking duplicates:', error);
      throw error;
    }
  }
  async function checkDuplicatesAssignWork(rrid) {
    // ตรวจสอบทุก Table โดยเก็บ table ลงใน Array
    const tables = [assignWork, receive_repair];
    try {
      // วนloop ตามจำนวน table
      for (let table of tables) {
        let result = await table.findOne({
          where: {rrid: rrid}
      });
        if (result) return true; // Duplicate found
      }
      return false; // No duplicates
    } catch (error) {
      console.error('Error checking duplicates:', error);
      throw error;
    }
  }
module.exports = { checkDuplicatesEmailPhone,checkDuplicatesName,checkDuplicatesAssignWork};
