const express = require('express');
// การนำเข้าโมเดลจากไฟล์โมเดลแต่ละไฟล์โดยตรง
const model = require('../../db/associatation')
const repairDetailRouter = express.Router();
const WebSocket = require('ws');
const wss = require('../../utils/WebSocketServer');

repairDetailRouter.post('/addDetail', async (req, res) => {
  const { request_status } = req.body;
  try {
    // Start a transaction
    await model.sequelize.transaction(async (t) => {
      // Create the repair detail
      const addDetail = await model.repairDetail.create(req.body, { transaction: t });

      // Fetch the related receiveRepair and requestForRepair records
      const detail = await model.repairDetail.findByPk(addDetail.rd_id, {
        include: [{
          model: model.receiveRepair,
          required: true,
          include: [{ model: model.requestForRepair }]
        }],
        transaction: t  // Pass transaction to findByPk
      });

      if (detail) {
        const reqRepair = detail.receive_repair.request_for_repair;

        // Update the request status
        const updatedRequest = await reqRepair.update({ request_status: request_status }, { transaction: t });

        // Create a notification
        await model.notification.create({
          noti_message: `มีการอัพเดทสถานะงาน: ${updatedRequest.request_status}`,
          emp_id: updatedRequest.employee_id
        }, { transaction: t });

        // Send WebSocket notification
        wss.clients.forEach(client => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({
              title: `${updatedRequest.rrid} อัพเดทสถานะ`,
              message: `มีการอัพเดทสถานะงาน: ${updatedRequest.request_status}`,
              user_id: updatedRequest.employee_id,
              role: "Employee",
              timestamp: new Date()
            }));
          }
        });

        res.status(201).json({ message: "เพิ่มรายละเอียดการซ่อมสำเร็จ" });
      } else {
        throw new Error('Related receiveRepair or requestForRepair not found');
      }
    });
  } catch (error) {
    console.error('Error creating repairDetail:', error);
    res.status(500).send('Server Error');
  }
});
// PUT update repairDetail
repairDetailRouter.put("/updateDetail/:id", async (req, res) => {
  try {
    const { request_status } = req.body;
    const detail_id = parseInt(req.params.id);

    // Start a transaction
    await model.sequelize.transaction(async (t) => {
      let checkStatusRequest = null;

      const detail = await model.repairDetail.findByPk(detail_id, {
        include: [{
          model: model.receiveRepair,
          required: true,  
          include: [{ model: model.requestForRepair }]
        }],
        transaction: t  // Pass transaction to findByPk
      }).catch(err => {
        console.error('Error fetching detail:', err);
        throw err;  // Rethrow the error to be caught by the outer try/catch
      });

      if (detail) {
        const reqRepair = detail.receive_repair.request_for_repair;
        checkStatusRequest = await reqRepair.update({ request_status: request_status }, { transaction: t });
        await model.notification.create({
          noti_message: `มีการอัพเดทสถานะงาน: ${reqRepair.request_status}`,
          emp_id: reqRepair.employee_id
        }, { transaction: t });
        wss.clients.forEach(client => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({
              title:`${reqRepair.rrid} อัพเดทสถานะ`,
              message: `มีการอัพเดทสถานะงาน: ${reqRepair.request_status}`,
              user_id: reqRepair.employee_id,
              role:"Employee",
              timestamp: new Date()
            }));
          }
        });
      }

      const updatedDetail = await model.repairDetail.update(req.body, {
        where: { rd_id: detail_id }
      }, { transaction: t });

      if (updatedDetail[0] > 0 || checkStatusRequest) {
        res.json({message:'Detail updated successfully'});
      } else {
        res.status(404).send('Detail Data is not found');
      }
    });
  } catch (error) {
    console.error('Error updating Detail:', error);
    res.status(500).send('Server Error');
  }
});
repairDetailRouter.get('/test', async (req, res) => {
    res.send('test')
});

module.exports = repairDetailRouter;
