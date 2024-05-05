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
repairDetailRouter.put("/updateDetail/:id", async (req, res) => {
  try {
      const {request_status} = req.body
      const detail_id = parseInt(req.params.id);
        // ค้นหา repair detail พร้อมรายละเอียดที่เกี่ยวข้อง receiveRepair และ requestForRepair
        // ในคำสั่ง SQL คือ SELECT * FROM repairDetail 
      if(request_status){
        const detail = await model.repairDetail.findByPk(detail_id, {
          include: [{
            model: model.receiveRepair,
            required: true,  // แก้ไขจาก require เป็น required และทำให้เป็น INNER JOIN
            include:[{model:model.requestForRepair}]
          }]
        }).catch(err => {
          console.error('Error fetching detail:', err);
        });
        const reqRepair = detail.receive_repair.request_for_repair; // ในส่วนนี้คือการเข้าtable Request for Repair ผ่าน repair detail ที่ได้ทำการ Join Table แล้ว
        await reqRepair.update({request_status:request_status});
      }
      const updatedDetail = await model.repairDetail.update(req.body, {
          where: { rd_id: detail_id }
      });
      if (updatedDetail[0] > 0) {
          res.send('Detail updated successfully');
      } else {
          res.status(404).send('repairDetailData is not found');
      }
  } catch (error) {
      console.error('Error updating Detail:', error);
      res.status(500).send('Server Error');
  }
});
repairDetailRouter.get('/test', async (req, res) => {
    res.send('test')
});

module.exports = repairDetailRouter;
