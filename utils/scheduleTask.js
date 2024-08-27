const wss = require('./WebSocketServer');
const WebSocket = require('ws');
const cron = require('node-cron');
const model = require('../db/associatation'); // ปรับเส้นทางตามที่จำเป็น
const { Sequelize } = require("sequelize");
const moment = require('moment');


const checkOverdueRequests = async () => {
  try {
    const currentTime = new Date();
    const overdueRequests = await model.requestForRepair.findAll({
        include: [
          {
              model: model.receiveRepair,
              attributes: [],
          },
        ],
        where: Sequelize.literal(
          `NOT EXISTS (
                  SELECT * FROM receive_repair WHERE receive_repair.rrid = request_for_repair.rrid
              )`),
      });

      const overdueRequest = overdueRequests.filter((timerequest) => {
        const MILLISECONDS_PER_SECOND = 1000;
        const SECONDS_PER_MIN = 60;
        const MIN_PER_HOUR = 60
        const HOURS_PER_DAY = 24;
        const MILLISECONDS_PER_DAY = MILLISECONDS_PER_SECOND * SECONDS_PER_MIN * MIN_PER_HOUR * HOURS_PER_DAY
        const requestTime = new Date(timerequest.timestamp);
        const differenceInTime = currentTime - requestTime;
        const differenceInDays = differenceInTime / MILLISECONDS_PER_DAY;
        return Math.ceil(differenceInDays) > 3;
      });
      // wss.clients.forEach(client => {
      //   if (client.readyState === WebSocket.OPEN) {
      //     client.send(JSON.stringify({
      //       title:`แจ้งเตือนคำขอไม่มีการรับงานเกิน 3 วัน`,
      //       message: `คำขอ  เกินกำหนดและยังไม่มีผู้รับงาน.`,
      //       user_id: '1',
      //       role:"Admin",
      //       timestamp: new Date()
      //     }));
      //   }
      // });
    if (overdueRequest.length > 0) {
      const admins = await model.admin.findAll();
      for (const admin of admins) {
        for (const request of overdueRequests) {
          await model.notification.create({
            noti_message: `คำขอ ${request.rrid} เกินกำหนดและยังไม่มีผู้รับงาน.`,
            admin_id: admin.admin_id,
            timestamp: new Date(),
          });

          // ส่งข้อความแจ้งเตือนผ่าน WebSocket
          wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
              client.send(JSON.stringify({
                title:`แจ้งเตือนคำขอไม่มีการรับงานเกิน 3 วัน`,
                message: `คำขอ ${request.rrid} เกินกำหนดและยังไม่มีผู้รับงาน.`,
                user_id: admin.admin_id,
                role:"Admin",
                timestamp: new Date()
              }));
            }
          });
        }
        console.log("send notification success")
      }
    }
  } catch (error) {
    console.error('Error checking overdue requests:', error);
  }
};

// กำหนดเวลางานให้ทำงานทุกวัน
cron.schedule('0 0 * * *', checkOverdueRequests);
