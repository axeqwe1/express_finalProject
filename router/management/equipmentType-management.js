const express = require('express');
const sequelize = require('../../db/config/sequelizeConfig');
const equipmentType = require('../../db/model/equipment_type')(sequelize);
const equipmentTypeRouter = express.Router();

// GET all equipment types
equipmentTypeRouter.get("/getequipmentstypes", async (req, res) => {
    try {
        const equipmentTypes = await equipmentType.findAll();
        res.json(equipmentTypes);
    } catch (error) {
        console.error('Error fetching equipment types:', error);
        res.status(500).send('Server Error');
    }
});

// GET equipment type by ID
equipmentTypeRouter.get("/getequipmenttype/:id", async (req, res) => {
    try {
        const equipmentTypeId = parseInt(req.params.id);
        const equipmentTypeData = await equipmentType.findByPk(equipmentTypeId);
        if (equipmentTypeData) {
            res.json(equipmentTypeData);
        } else {
            res.status(404).send('Equipment type not found');
        }
    } catch (error) {
        console.error('Error fetching equipment type:', error);
        res.status(500).send('Server Error');
    }
});

// POST new equipment type
equipmentTypeRouter.post("/addequipmenttype", async (req, res) => {
    try {
        const newEquipmentType = await equipmentType.create(req.body);
        res.status(201).json(newEquipmentType);
    } catch (error) {
        console.error('Error adding equipment type:', error);
        res.status(500).send('Server Error');
    }
});

// PUT update equipment type
equipmentTypeRouter.put("/updateequipmenttype/:id", async (req, res) => {
    try {
        const equipmentTypeId = parseInt(req.params.id);
        const updatedEquipmentType = await equipmentType.update(req.body, {
            where: { eqc_id: equipmentTypeId }
        });
        if (updatedEquipmentType[0] > 0) {
            res.send('Equipment type updated successfully');
        } else {
            res.status(404).send('Equipment type not found');
        }
    } catch (error) {
        console.error('Error updating equipment type:', error);
        res.status(500).send('Server Error');
    }
});

// DELETE an equipment type
equipmentTypeRouter.delete("/deleteequipmenttype/:id", async (req, res) => {
    try {
        const equipmentTypeId = parseInt(req.params.id);
        const deletedEquipmentType = await equipmentType.destroy({
            where: { equipment_id: equipmentTypeId }
        });
        if (deletedEquipmentType) {
            res.send('Equipment type deleted successfully');
        } else {
            res.status(404).send('Equipment type not found');
        }
    } catch (error) {
        console.error('Error deleting equipment type:', error);
        res.status(500).send('Server Error');
    }
});

module.exports = equipmentTypeRouter;
