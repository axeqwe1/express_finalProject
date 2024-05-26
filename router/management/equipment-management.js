const express = require('express');
const sequelize = require('../../db/config/sequelizeConfig');
const equipment = require('../../db/model/equipment')(sequelize);
const equipmentRouter = express.Router();

// GET all equipment
equipmentRouter.get("/getequipments", async (req, res) => {
    try {
        const equipments = await equipment.findAll();
        res.json(equipments);
    } catch (error) {
        console.error('Error fetching equipments:', error);
        res.status(500).send('Server Error');
    }
});

// GET equipment by ID
equipmentRouter.get("/getequipment/:id", async (req, res) => {
    try {
        const equipmentId = parseInt(req.params.id);
        const equipmentData = await equipment.findByPk(equipmentId);
        if (equipmentData) {
            res.json(equipmentData);
        } else {
            res.status(404).send('Equipment not found');
        }
    } catch (error) {
        console.error('Error fetching equipment:', error);
        res.status(500).send('Server Error');
    }
});

// POST new equipment
equipmentRouter.post("/addequipment", async (req, res) => {
    try {
        const newEquipment = await equipment.create(req.body);
        res.status(201).json(newEquipment);
    } catch (error) {
        console.error('Error adding equipment:', error);
        res.status(500).send('Server Error');
    }
});

// PUT update equipment
equipmentRouter.put("/updateequipment/:id", async (req, res) => {
    try {
        const equipmentId = parseInt(req.params.id);
        const updatedEquipment = await equipment.update(req.body, {
            where: { eq_id: equipmentId }
        });
        if (updatedEquipment[0] > 0) {
            res.send('Equipment updated successfully');
        } else {
            res.status(404).send('Equipment not found');
        }
    } catch (error) {
        console.error('Error updating equipment:', error);
        res.status(500).send('Server Error');
    }
});

// DELETE an equipment
equipmentRouter.delete("/deleteequipment/:id", async (req, res) => {
    try {
        const equipmentId = parseInt(req.params.id);
        const deletedEquipment = await equipment.destroy({
            where: { eq_id: equipmentId }
        });
        if (deletedEquipment) {
            res.send('Equipment deleted successfully');
        } else {
            res.status(404).send('Equipment not found');
        }
    } catch (error) {
        console.error('Error deleting equipment:', error);
        res.status(500).send('Server Error');
    }
});

module.exports = equipmentRouter;