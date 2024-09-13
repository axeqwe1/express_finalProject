const express = require('express');
// การนำเข้าโมเดลจากไฟล์โมเดลแต่ละไฟล์โดยตรง
const model = require('../../db/associatation')
const repairDetailRouter = express.Router();
const WebSocket = require('ws');
const wss = require('../../utils/WebSocketServer');
const {Sequelize} = require('sequelize');
const { fetchBacklogTech } = require('../../utils/fetchBacklogTechnician');
repairDetailRouter.post('/addDetail', async (req, res) => {
  const { request_status } = req.body;
  let rd_id
  try {
    // Start a transaction
    await model.sequelize.transaction(async (t) => {
      // Create the repair detail
      const addDetail = await model.repairDetail.create(req.body, { transaction: t });
      rd_id = addDetail.rd_id
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
        console.log(`eq id is:${reqRepair.eq_id} and request_status is ${request_status}`)
      
        // อัปเดตสถานะอุปกรณ์
        if(request_status == "ไม่สามารถซ่อมได้"){
          console.log("IsUpdate เสียหายไม่สามารถซ่อมได้")
          await model.equipment.update(
            {
              eq_status:"เสียซ่อมไม่ได้"
            },
            {
              where:{
                eq_id:reqRepair.eq_id
              },
              transaction: t
            })
        }else if(request_status == "ส่งคืนเสร็จสิ้น"){
          console.log("IsUpdate ส่งคืนเสร็จสิ้น")
          await model.equipment.update(
            {
              eq_status:"กำลังใช้งาน"
            },
            {
              where:{
                eq_id:reqRepair.eq_id
              },
              transaction: t
            })
        }
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
    }).then(async () => {
      // Fetch the repair detail with related receiveRepair and requestForRepair
      const detail = await model.repairDetail.findByPk(rd_id, {
        include: [{
          model: model.receiveRepair,
          required: true,  
          include: [{ model: model.requestForRepair }]
        }],
      }).catch(err => {
        console.error('Error fetching detail:', err);
        throw err;  // Rethrow the error to be caught by the outer try/catch
      });
      // Fetch technician backlog after all updates
      
      const techId = detail.receive_repair.tech_id;
      const backlog = await fetchBacklogTech(techId);
      console.log(`backlog is ${backlog}`);

      // Update technician status if no backlog
      if (backlog < 1) {
        const idStatus = await model.technicianStatus.findOne({
          where: { receive_request_status: 'A' },
          attributes: ['status_id'] // ดึงเฉพาะฟิลด์ 'id'
        });

        if (idStatus) {
          console.log(`status id is ${idStatus.status_id}  tech id is${techId}`); // แสดงเฉพาะค่า id
          await model.technician.update({
            status_id: idStatus.status_id
          }, {
            where: { tech_id: techId }
          });
        } else {
          console.log('No matching record found');
        }
      }else{
        console.log('No Need to Update Status Techniciain');
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

      // Fetch the repair detail with related receiveRepair and requestForRepair
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

        // Update the request status
        checkStatusRequest = await reqRepair.update({ request_status: request_status }, { transaction: t });

        // Create a notification
        await model.notification.create({
          noti_message: `มีการอัพเดทสถานะงาน: ${reqRepair.request_status}`,
          emp_id: reqRepair.employee_id
        }, { transaction: t });

        // Send WebSocket notification
        wss.clients.forEach(client => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({
              title: `${reqRepair.rrid} อัพเดทสถานะ`,
              message: `มีการอัพเดทสถานะงาน: ${reqRepair.request_status}`,
              user_id: reqRepair.employee_id,
              role: "Employee",
              timestamp: new Date()
            }));
          }
        });
      }

      // Update repair detail
      const updatedDetail = await model.repairDetail.update(req.body, {
        where: { rd_id: detail_id }
      }, { transaction: t });

      // อัปเดตสถานะอุปกรณ์
      if(request_status == "เสียหายไม่สามารถซ่อมได้"){
        console.log("IsUpdate เสียหายไม่สามารถซ่อมได้")
        await model.equipment.update(
          {
            eq_status:"เสียซ่อมไม่ได้"
          },
          {
            where:{
              eq_id:reqRepair.eq_id
            },
            transaction: t
          })
      }else if(request_status == "ส่งคืนเสร็จสิ้น"){
        console.log("IsUpdate ส่งคืนเสร็จสิ้น")
        await model.equipment.update(
          {
            eq_status:"กำลังใช้งาน"
          },
          {
            where:{
              eq_id:reqRepair.eq_id
            },
            transaction: t
          })
      }

      // Check if updates were successful
      if (updatedDetail[0] > 0 || checkStatusRequest) {
        res.json({ message: 'Detail updated successfully' });
      } else {
        res.status(404).send('Detail Data is not found');
      }
    }).then(async () => {
      // Fetch the repair detail with related receiveRepair and requestForRepair
      const detail = await model.repairDetail.findByPk(detail_id, {
        include: [{
          model: model.receiveRepair,
          required: true,  
          include: [{ model: model.requestForRepair }]
        }],
      }).catch(err => {
        console.error('Error fetching detail:', err);
        throw err;  // Rethrow the error to be caught by the outer try/catch
      });
      // Fetch technician backlog after all updates
      
      const techId = detail.receive_repair.tech_id;
      const backlog = await fetchBacklogTech(techId);
      console.log(`backlog is ${backlog}`);

      // Update technician status if no backlog
      if (backlog < 1) {
        const idStatus = await model.technicianStatus.findOne({
          where: { receive_request_status: 'A' },
          attributes: ['status_id'] // ดึงเฉพาะฟิลด์ 'id'
        });

        if (idStatus) {
          console.log(`status id is ${idStatus.status_id}  tech id is${techId}`); // แสดงเฉพาะค่า id
          await model.technician.update({
            status_id: idStatus.status_id
          }, {
            where: { tech_id: techId }
          });
        } else {
          console.log('No matching record found');
        }
      }else{
        console.log('No Need to Update Status Techniciain');
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

// const fetchBacklogTech = async (techId) =>{
//           // fetch จำนวนการรับงาน
//           const count = await model.receiveRepair.findAll({
//             where:{tech_id:techId},
//             attributes:[[Sequelize.fn('COUNT',Sequelize.col('receive_repair.rrid')),'receive']]
//         })
  
//           const successCount = await model.requestForRepair.findAll({
//             where:{
//                 request_status:'ส่งคืนเสร็จสิ้น'
//             },
//             include:[{
//                 model:model.receiveRepair,
//                 required:true,
//                 where:{tech_id:techId},
//                 attributes:[]
//             }],
//             attributes:[
//                 [Sequelize.fn('COUNT',Sequelize.col('request_for_repair.rrid')),'successWork'],
//             ],
//             group:[`receive_repair.tech_id`]
//         })
//           // ตรวจข้อมูลใน array ว่ามีข้อมูลหรือเปล่า --> จำนวนงานทั้งหมด
//           if(!count[0]){
//             totalCount = 0
//           }else{
//                 totalCount = parseInt(count[0].dataValues.receive)
//           }
//           // ตรวจข้อมูลใน array ว่ามีข้อมูลหรือเปล่า --> จำนวนงานที่ทำเสร็จ
//           if(!successCount[0]){
//                 succCount = 0
//           }else{
//                 succCount = parseInt(successCount[0].dataValues.successWork)
//           }
//           const Backlog = totalCount - succCount

//           return Backlog
// }
module.exports = repairDetailRouter;
