const cron = require('node-cron');
const model = require('../db/associatation'); // ปรับเส้นทางตามที่จำเป็น
const { Op } = require('sequelize');
const moment = require('moment');
const { Sequelize } = require("sequelize");

const checkOverdueRequests = async () => {
  try {
    const threeDaysAgo = moment().subtract(3, 'days').toDate();

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

    if (overdueRequests.length > 0) {
      const admins = await model.admin.findAll();

      for (const admin of admins) {
        for (const request of overdueRequests) {
          await model.notification.create({
            noti_message: `คำขอ ${request.rrid} เกินกำหนดและยังไม่มีผู้รับงาน.`,
            admin_id: admin.admin_id,
            timestamp: new Date(),
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
