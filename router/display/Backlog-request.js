const express = require("express");
const router = express.Router();
const model = require("../../db/associatation");
const { Sequelize } = require("sequelize");

router.get("/backlog-request-list", async (req, res) => {
  try {
    const currentTime = new Date();
    const timerequest = await model.requestForRepair.findAll({
      include: [
        {
          model: model.receiveRepair,
          required: false,
          attributes: [],
        },
      ],
      where: Sequelize.literal(
        `NOT EXISTS (
                SELECT * FROM receive_repair WHERE receive_repair.rrid = request_for_repair.rrid
            )`),
    });
    // ตรวจสอบว่าเงินเกิน 3 วันหรือเปล่า
    const overdueRequest = timerequest.filter((timerequest) => {
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
    return res.send({ data: overdueRequest});
  } catch (err) {
    return res.send(err);
  }
});

module.exports = router;
