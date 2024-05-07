const express = require("express");
const router = express.Router();
const sequelize = require("../../db/config/sequelizeConfig"); // Asumming your sequelize instance is exported from this module

router.post('/search-request', async (req, res) => {
    const { searchVal } = req.body;
    const sql = `
        SELECT
            request_for_repair.rrid,
            employee.firstname,
            employee.lastname,
            equipment.eq_name,
            department.departmentName,
            request_for_repair.timestamp
        FROM
            request_for_repair
        INNER JOIN employees AS employee ON request_for_repair.employee_id = employee.emp_id
        INNER JOIN departments AS department ON employee.department_id = department.department_id
        INNER JOIN equipments AS equipment ON request_for_repair.eq_id = equipment.eq_id
        WHERE
            request_for_repair.rrid LIKE '%${searchVal}%' OR
            request_for_repair.timestamp LIKE '%${searchVal}%' OR
            employee.firstname LIKE '%${searchVal}%' OR
            employee.lastname LIKE '%${searchVal}%' OR
            department.departmentName LIKE '%${searchVal}%' OR
            equipment.eq_name LIKE '%${searchVal}%';
    `;
    try {
        const [results] = await sequelize.query(sql);
        console.log(results)
        return res.json({ results});
    } catch (error) {
        console.error("Search failed:", error);
        res.status(500).send("Error performing search");
    }
});

module.exports = router;
