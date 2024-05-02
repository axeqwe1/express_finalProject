const express = require('express');
const sequelize = require('../../db/sequelizeConfig');
const levelOfDamage = require('../../db/model/building')(sequelize); // Correctly referencing the building model
const levelOfDamageRouter = express.Router();

// GET all buildings
levelOfDamageRouter.get("/getloeds", async (req, res) => {
    try {
        const buildings = await levelOfDamage.findAll();
        res.json(buildings);
    } catch (error) {
        console.error('Error fetching buildings:', error);
        res.status(500).send('Server Error');
    }
});

// GET building by ID
levelOfDamageRouter.get("/getloed/:id", async (req, res) => {
    try {
        const buildingId = parseInt(req.params.id);
        const buildingData = await levelOfDamage.findByPk(buildingId);
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
levelOfDamageRouter.post("/addloed", async (req, res) => {
    try {
        const newBuilding = await levelOfDamage.create(req.body);
        res.status(201).json(newBuilding);
    } catch (error) {
        console.error('Error adding building:', error);
        res.status(500).send('Server Error');
    }
});

// PUT update building
levelOfDamageRouter.put("/updateloed/:id", async (req, res) => {
    try {
        const buildingId = parseInt(req.params.id);
        const updatedBuilding = await levelOfDamage.update(req.body, {
            where: { building_id: buildingId }
        });
        if (updatedBuilding[0] > 0) {
            res.send('Building updated successfully');
        } else {
            res.status(404).send('Building not found');
        }
    } catch (error) {
        console.error('Error updating building:', error);
        res.status(500).send('Server Error');
    }
});

// DELETE a building
levelOfDamageRouter.delete("/deleteloed/:id", async (req, res) => {
    try {
        const buildingId = parseInt(req.params.id);
        const deletedBuilding = await levelOfDamage.destroy({
            where: { building_id: buildingId }
        });
        if (deletedBuilding) {
            res.send('Building deleted successfully');
        } else {
            res.status(404).send('Building not found');
        }
    } catch (error) {
        console.error('Error deleting building:', error);
        res.status(500).send('Server Error');
    }
});

module.exports = levelOfDamageRouter;