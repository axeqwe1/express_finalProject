const express = require('express');
const sequelize = require('../../db/config/sequelizeConfig');
const building = require('../../db/model/building')(sequelize); // Correctly referencing the building model
const buildingRouter = express.Router();

// GET all buildings
buildingRouter.get("/getbuildings", async (req, res) => {
    try {
        const buildings = await building.findAll();
        res.json(buildings);
    } catch (error) {
        console.error('Error fetching buildings:', error);
        res.status(500).send('Server Error');
    }
});

// GET building by ID
buildingRouter.get("/getbuilding/:id", async (req, res) => {
    try {
        const buildingId = parseInt(req.params.id);
        const buildingData = await building.findByPk(buildingId);
        if (buildingData) {
            res.json(buildingData);
        } else {
            res.status(404).send('Building not found');
        }
    } catch (error) {
        console.error('Error fetching building:', error);
        res.status(500).send('Server Error');
    }
});

// POST new building
buildingRouter.post("/addbuilding", async (req, res) => {
    try {
        const newBuilding = await building.create(req.body);
        res.status(201).json(newBuilding);
    } catch (error) {
        console.error('Error adding building:', error);
        res.status(500).send('Server Error');
    }
});

// PUT update building
buildingRouter.put("/updatebuilding/:id", async (req, res) => {
    try {
        const buildingId = parseInt(req.params.id);
        const updatedBuilding = await building.update(req.body, {
            where: { building_id: buildingId }
        });
        if (updatedBuilding[0] > 0) {
            res.send('Building updated successfully');
        } else {

        }
    } catch (error) {
        console.error('Error updating building:', error);
        res.status(500).send('Server Error');
    }
});

// DELETE a building
buildingRouter.delete("/deletebuilding/:id", async (req, res) => {
    try {
        const buildingId = parseInt(req.params.id);
        const deletedBuilding = await building.destroy({
            where: { building_id: buildingId }
        });
        if (deletedBuilding) {
            res.send('Building deleted successfully');
        } else {
            res.status(404).send('Building not found');
        }
    } catch (error) {
        console.error('Error deleting building:', error);
        if (error.name === 'SequelizeForeignKeyConstraintError') {
            res.status(409).send('ไม่สามารถลบข้อมูลนี้ได้ขณะนี้เนื่องจากมีการใช้ข้อมูลนี้ในระบบ.' );
        } else {
            res.status(500).send('Server Error');
        }
    }
});

module.exports = buildingRouter;
