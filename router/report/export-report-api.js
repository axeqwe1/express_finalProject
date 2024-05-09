const express = require("express");
const { Op, Sequelize } = require("sequelize");
const { parse } = require("json2csv");
const router = express.Router();
const model = require("../../db/associatation");
const sequelize = require("../../db/config/sequelizeConfig");
router.get("/export-csv", async (req, res) => {
  const fields = [
    { label: "rrid", value: "rrid"},
    { label: "statusRequest", value: "request_status"},
    { label: "equipmentName", value: "eq_name"},
    { label: "RepairCountEq", value: "repair_count"},
    { label: "equipmentType", value: "eqc_name" },
    {
      label: "technicianReceiveName",
      value: (record) => {
        const firstName = record.firstname ? record.firstname : ""; // ตรวจสอบค่า null ของ record.firstname
        const lastName = record.lastname ? record.lastname : ""; // ตรวจสอบค่า null ของ record.lastname
        return `${firstName} ${lastName}`; // รวมเป็น string
      },
    },
    { label: "DateRequest", value: "timestamp" },
    { label: "Total Requests", value: "request_count" },
  ];

  const { start_date, end_date } = req.body;
  try {
    const sql = `
        SELECT
        rfr.rrid,
        rfr.eq_id,
        rfr.request_status,
        eq.eq_name,
        eqType.eqc_name,
        tech.firstname,
        tech.lastname,
        coalesce(eq_repairs.repair_count, 0) AS repair_count,
        rfr.timestamp
    FROM
        request_for_repair AS rfr
    LEFT JOIN
        receive_repair AS rrce ON rrce.rrid = rfr.rrid
    LEFT JOIN
        technicians AS tech ON rrce.tech_id = tech.tech_id
    LEFT JOIN
        equipments AS eq ON rfr.eq_id = eq.eq_id
    LEFT JOIN
        equipment_Types AS eqType ON eq.eqc_id = eqType.eqc_id
    LEFT JOIN
        (SELECT
            COUNT(rr.eq_id) AS repair_count,
            rr.eq_id
         FROM
            request_for_repair AS rr
         GROUP BY
            rr.eq_id) AS eq_repairs ON eq_repairs.eq_id = eq.eq_id
    WHERE
        rfr.timestamp BETWEEN '${start_date} 00:00:00' AND '${end_date} 23:59:59';
    `;
    const [results] = await sequelize.query(sql);

    const totalRequest = await model.requestForRepair.findAll({
      where: {
        timestamp: {
          [Op.between]: [
            `${start_date} 00:00:00`,
            `${end_date} 23:59:59`,
          ],
        },
      },
      attributes: [
        [Sequelize.fn("COUNT", Sequelize.col("rrid")), "request_count"],
      ],
    });
    const data = results;
    data[0] = { ...data[0], ...totalRequest[0].dataValues };
    console.log(data[0]);
    const opts = { fields };
    const csv = parse(data, opts);

    // กำหนดชื่อไฟล์ในการดาวน์โหลด
    res.header("Content-Type", "text/csv");
    res.attachment("CustomFileName.csv");
    res.send(csv);

    // console.log(results[0])
  } catch (err) {
    console.error(err);
    return res.send({ error: err });
  }
});

module.exports = router;
