const express = require('express');
// การนำเข้าโมเดลจากไฟล์โมเดลแต่ละไฟล์โดยตรง
const model = require('../../db/associatation')
const repairDetailRouter = express.Router();

repairDetailRouter.post('/addDetail', async (req, res) => {
  try {
    const addDetail = await model.repairDetail.create(req.body)
    res.status(201).json(addDetail);
  } catch (error) {
    console.error('Error creating repairDetail:', error);
    res.status(500).send('Server Error');
  }
});
// PUT update repairDetail
// repairDetailRouter.put("/updateDetail/:id", async (req, res) => {
//   try {
//       const {request_status} = req.body
//       const detail_id = parseInt(req.params.id);
//       let checkStatusRequest = null
//       if(request_status){
//         const detail = await model.repairDetail.findByPk(detail_id, {
//           include: [{
//             model: model.receiveRepair,
//             required: true,  
//             include:[{model:model.requestForRepair}]
//           }]
//         }).catch(err => {
//           console.error('Error fetching detail:', err);
//         });
//         if(detail != null){
//           const reqRepair = detail.receive_repair.request_for_repair; // ในส่วนนี้คือการเข้าtable Request for Repair ผ่าน repair detail ที่ได้ทำการ Join Table แล้ว
//           checkStatusRequest = await reqRepair.update({request_status:request_status}); // update ใน instance จะ return this
//           const NotificationToEmployee = await model.notification.create({
//             noti_message:`มีการอัพเดทสถานะงาน: ${reqRepair.request_status}`,
//             emp_id:reqRepair.employee_id
//           })
//         }
//       }
//       const updatedDetail = await model.repairDetail.update(req.body, { // update ใน model จะ return เป็นจำนวน row ที่อัพเดท
//           where: { rd_id: detail_id }
//       });
//       if (updatedDetail[0] > 0 || checkStatusRequest != null) {
//           res.send('Detail updated successfully');
//       } else {
//           res.status(404).send('Detail Data is not found');
//       }
//   } catch (error) {
//       console.error('Error updating Detail:', error);
//       res.status(500).send('Server Error');
//   }
// });
repairDetailRouter.put("/updateDetail/:id", async (req, res) => {
  try {
    const { request_status } = req.body;
    const detail_id = parseInt(req.params.id);

    // Start a transaction
    const result = await model.sequelize.transaction(async (t) => {
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
        const NotificationToEmployee = await model.notification.create({
          noti_message: `มีการอัพเดทสถานะงาน: ${reqRepair.request_status}`,
          emp_id: reqRepair.employee_id
        }, { transaction: t });
      }

      const updatedDetail = await model.repairDetail.update(req.body, {
        where: { rd_id: detail_id }
      }, { transaction: t });

      if (updatedDetail[0] > 0 || checkStatusRequest) {
        res.send('Detail updated successfully');
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
