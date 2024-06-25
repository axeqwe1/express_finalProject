const express = require('express');
const sequelize = require('../../db/config/sequelizeConfig');
const RequestForRepair = require('../../db/model/requestForRepair')(sequelize);
const Notification = require('../../db/model/notification')(sequelize);
const Admin = require('../../db/model/admin')(sequelize); 
const model = require('../../db/associatation')
const requestRouter = express.Router();
const WebSocket = require('ws');
const wss = require('../../utils/WebSocketServer');

requestRouter.post('/repair', async (req, res) => {
  const { description, picture, employeeId, buildingId, equipmentId } = req.body;

  try {
    const result = await sequelize.transaction(async (t) => {
      const repair = await model.requestForRepair.create({
        rr_description: description,
        rr_picture: picture,
        request_status: "กำลังส่งการแจ้งซ่อม",
        employee_id: employeeId,
        building_id: buildingId,
        eq_id: equipmentId
      }, { transaction: t });

      // ดึงข้อมูล Admin ทั้งหมด
      const admins = await Admin.findAll({ transaction: t });

      // สร้างการแจ้งเตือนสำหรับแต่ละ Admin
      const notifications = await Promise.all(admins.map(async (items) => {
        wss.clients.forEach(client => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({
              title:`มีคำขอเข้าสู่ระบบ`,
              message: `มีคำขอการแจ้งซ่อมเข้าสู่ระบบ:${description}.`,
              user_id: items.admin_id,
              role:"Admin",
              timestamp: new Date()
            }));
          }
        });

        return model.notification.create({
          noti_message: `New repair request created: ${description}`,
          admin_id: items.admin_id  // ตรวจสอบว่าชื่อฟิลด์ในโมเดล Notification คือ admin_id
        }, { transaction: t })
  
      }));

      return { repair, notifications };
    });

    res.status(201).json(result);
  } catch (error) {
    console.error('Error creating repair and notification:', error);
    res.status(500).send('Server Error');
  }
});
requestRouter.put("/updateRequestData/:id", async (req, res) => {
  try {
      const rrid = parseInt(req.params.id);
      const updatedRepairRequest = await model.requestForRepair.update(req.body, {
          where: { rrid: rrid }
      });
      if (updatedRepairRequest[0] > 0) {
          res.send('Request updated successfully');
      } else {
          res.status(404).send('RequestRepairData is not found');
      }
  } catch (error) {
      console.error('Error updating RequestData:', error);
      res.status(500).send('Server Error');
  }
});
requestRouter.get('/test', async (req, res) => {
    res.send('test')
});

module.exports = requestRouter;