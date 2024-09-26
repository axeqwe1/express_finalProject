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
    // ตรวจสอบสถานะอุปกรณ์ก่อนที่จะดำเนินการแจ้งซ่อม
    const equipment = await model.equipment.findByPk(equipmentId);

    console.log(`equipment status is ${equipment.eq_status}`)
    if (!equipment) {
      return res.status(404).send( 'ไม่พบข้อมูลอุปกรณ์' );
    }
    else if (equipment.eq_status == 'ส่งซ่อม') {
      return res.status(400).send('อุปกรณ์ไม่สามารถแจ้งซ่อมได้เนื่องจากมีการแจ้งซ่อมอุปกรณ์นี้ในระบบแล้ว' );
    }
    else if (equipment.eq_status == 'เสียซ่อมไม่ได้'){
      return res.status(400).send('อุปกรณ์ไม่สามารถแจ้งซ่อมได้เนื่องจากมีการแจ้งซ่อมแล้วอุปกรณ์ไม่สามารถซ่อมได้');
    }else{
      await sequelize.transaction(async (t) => {
        const repair = await model.requestForRepair.create({
          rr_description: description,
          rr_picture: picture,
          request_status: "กำลังส่งการแจ้งซ่อม",
          employee_id: employeeId,
          building_id: buildingId,
          eq_id: equipmentId
        }, { transaction: t });
  
        // อัปเดตสถานะอุปกรณ์
        await model.equipment.update(
          {
            eq_status:"ส่งซ่อม"
          },
          {
            where:{
              eq_id:equipmentId
            },
            transaction: t
          })
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
          }, { transaction: t });
        }));
        console.log(`repair is ${repair}  noti is ${notifications}`)
        // ส่งการตอบกลับ
        res.status(201).json({ repair: repair.request_for_repair, notifications: notifications.notifications });
      });
    }
  } catch (error) {
    console.error('Error creating repair and notification:', error);
    res.status(500).send('Server Error');
  }
});


requestRouter.get('/test', async (req, res) => {
    res.send('test')
});

module.exports = requestRouter;