const express = require('express');
const sequelize = require('../../db/config/sequelizeConfig');
// การนำเข้าโมเดลจากไฟล์โมเดลแต่ละไฟล์โดยตรง
const model = require('../../db/associatation')
const assignRouter = express.Router();
const { checkDuplicatesAssignWork } = require('../../utils/validation');
const WebSocket = require('ws');
const wss = require('../../utils/WebSocketServer');
// POST /repairs - Create a new repair request and a notification
assignRouter.post('/assign', async (req, res) => {
  const { admin_id,tech_id,rrid } = req.body;
  try {
    if(await checkDuplicatesAssignWork(rrid)){
      return res.send('คำขอนี้มีการจ่ายงานไปแล้ว')
    }
    const result = await sequelize.transaction(async (t) => {
      const assign = await model.assignWork.create({
        admin_id: admin_id,
        tech_id: tech_id,
        rrid: rrid,
      }, { transaction: t });

      const receive = await model.receiveRepair.create({
        tech_id: tech_id,
        rrid: rrid,
      },{tracnsaction:t})

      const notificationTechnician = await model.notification.create({
        noti_message: `ได้รับมอบหมายงาน ${rrid}`,
        tech_id: tech_id  // ตรงนี้ก็ต้องให้แน่ใจว่าส่งค่าที่ถูกต้อง
      }, { transaction: t });

      wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({
            title:`ได้รับมอบหมายงาน`,
            message: `รหัสงาน:${rrid}`,
            user_id: tech_id,
            role:"Technician",
            timestamp: new Date()
          }));
        }
      });
      
      const employeeFromRequest = await model.requestForRepair.findAll(
        {
          where:{rrid:rrid},
          transaction: t
        });

      const notificationEmployee = await Promise.all(employeeFromRequest.map(items => {
        wss.clients.forEach(client => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({
              title:`รับงาน`,
              message: `คำขอ ${rrid} ได้มีคนรับงานแล้ว`,
              user_id: items.employee_id,
              role:"Employee",
              timestamp: new Date()
            }));
          }
        });
        return model.notification.create({
          noti_message: `คำขอ ${rrid} ได้มีคนรับงานแล้ว`,
          emp_id: items.employee_id  // ตรงนี้ก็ต้องให้แน่ใจว่าส่งค่าที่ถูกต้อง
        }, { transaction: t });
      }))
      // const notificationEmployee = await 
      const updateStatusRequest = await model.requestForRepair.update({
          request_status:"กำลังดำเนินการ"
      },{
        where:{rrid:rrid},
        transaction: t
      })
      return { message:"จ่ายงานสำเร็จ" };
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
