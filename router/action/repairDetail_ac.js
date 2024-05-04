const express = require('express');
const sequelize = require('../../db/config/sequelizeConfig');
// การนำเข้าโมเดลจากไฟล์โมเดลแต่ละไฟล์โดยตรง
const assignWork = require('../../db/model/assignWork')(sequelize);
const receiveRepair = require('../../db/model/receiveRepair')(sequelize)
const Notification = require('../../db/model/notification')(sequelize);
const RequestForRepair = require('../../db/model/requestForRepair')(sequelize)
const repairDetail = require('../../db/model/repairDetails')(sequelize)
const repairDetailRouter = express.Router();

repairDetailRouter.post('/addDetail', async (req, res) => {
  try {
    const addDetail = await repairDetail.create(req.body)
    res.status(201).json(addDetail);
  } catch (error) {
    console.error('Error creating repairDetail:', error);
    res.status(500).send('Server Error');
  }
});
// PUT update repairDetail
repairDetailRouter.put("/updateDetail/:id", async (req, res) => {
  try {

      const detail_id = parseInt(req.params.id);
      const updatedDetail = await repairDetail.update(req.body, {
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
