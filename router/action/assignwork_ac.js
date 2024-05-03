const express = require('express');
const sequelize = require('../../db/sequelizeConfig');
// การนำเข้าโมเดลจากไฟล์โมเดลแต่ละไฟล์โดยตรง
const assignWork = require('../../db/model/assignWork')(sequelize);
const receiveRepair = require('../../db/model/receiveRepair')(sequelize)
const Notification = require('../../db/model/notification')(sequelize);
const RequestForRepair = require('../../db/model/requestForRepair')(sequelize)
const assignRouter = express.Router();

// POST /repairs - Create a new repair request and a notification
assignRouter.post('/assign', async (req, res) => {
  const { admin_id,tech_id,rrid } = req.body;

  try {
    const result = await sequelize.transaction(async (t) => {

      const assign = await assignWork.create({
        admin_id: admin_id,
        tech_id: tech_id,
        rrid: rrid,
      }, { transaction: t });

      const receive = await receiveRepair.create({
        tech_id: tech_id,
        rrid: rrid,
      },{tracnsaction:t})

      const notificationTechnician = await Notification.create({
        noti_message: `you got assign work:${rrid} assign by:${admin_id}`,
        tech_id: tech_id  // ตรงนี้ก็ต้องให้แน่ใจว่าส่งค่าที่ถูกต้อง
      }, { transaction: t });
      
      const employeeNameFromRequest = await RequestForRepair.findAll(
        {
          where:{
            rrid:rrid
          },
          transaction: t
        });
      const notificationEmployee = await Promise.all(employeeNameFromRequest.map(items => {
        return Notification.create({
          noti_message: `คำขอ ${rrid} ได้มีคนรับงานแล้ว`,
          emp_id: items.employee_id  // ตรงนี้ก็ต้องให้แน่ใจว่าส่งค่าที่ถูกต้อง
        }, { transaction: t });
      }))
      // const notificationEmployee = await 
      const updateStatusRequest = await RequestForRepair.update({
          request_status:"pending"
      },{
        where:{rrid:rrid},
        transaction: t
      })
      return { assign,receive, notificationTechnician,notificationEmployee,updateStatusRequest };
    });

    res.status(201).json(result);
  } catch (error) {
    console.error('Error creating repair and notification:', error);
    res.status(500).send('Server Error');
  }
});
// Get /repairs - Create a new repair request and a notification
assignRouter.get('/test', async (req, res) => {
    res.send('test')
});

module.exports = assignRouter;
