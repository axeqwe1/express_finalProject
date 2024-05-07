const express = require("express");
const router = express.Router();
const sequelize = require("../../db/config/sequelizeConfig"); // Asumming your sequelize instance is exported from this module

router.post('/search-equipment', async (req, res) => {
    const { searchVal } = req.body;
    const sql = `
        SELECT
            *
        FROM equipments AS eq
        INNER JOIN equipment_Types AS eqc ON eq.eqc_id = eqc.eqc_id
        WHERE
            eq.eq_name LIKE '%${searchVal}%' OR
            eqc.eqc_name LIKE '%${searchVal}%' OR
            eq.eq_id LIKE '%${searchVal}%'
    `;
    try {
        const [results] = await sequelize.query(sql);
        return res.json({ results});
    } catch (error) {
        console.error("Search failed:", error);
        res.status(500).send("Error performing search");
    }
});

module.exports = router;
