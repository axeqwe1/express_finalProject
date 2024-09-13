const express = require('express');
const sequelize = require('../../db/config/sequelizeConfig');
const loed = require('../../db/model/levelOfDamage')(sequelize); // Correctly referencing the building model
const loedRouter = express.Router();

// GET all loeds
loedRouter.get("/getloeds", async (req, res) => {
    try {
        const loeds = await loed.findAll();
        res.json(loeds);
    } catch (error) {
        console.error('Error fetching loeds:', error);
        res.status(500).send('Server Error');
    }
});

// GET loed by ID
loedRouter.get("/getloed/:id", async (req, res) => {
    try {
        const loedId = parseInt(req.params.id);
        const loedData = await loed.findByPk(loedId);
        if (loedData) {
            res.json(loedData);
        } else {
            res.status(404).send('Loed not found');
        }
    } catch (error) {
        console.error('Error fetching loed:', error);
        res.status(500).send('Server Error');
    }
});

// POST new loed
loedRouter.post("/addloed", async (req, res) => {
    try {
        const newLoed = await loed.create(req.body);
        res.status(201).json(newLoed);
    } catch (error) {
        console.error('Error adding loed:', error);
        res.status(500).send('Server Error');
    }
});

// PUT update loed
loedRouter.put("/updateloed/:id", async (req, res) => {
    try {
        const loedId = parseInt(req.params.id);
        const updatedLoed = await loed.update(req.body, {
            where: { loed_id: loedId }
        });
        res.send('Loed updated successfully');
    } catch (error) {
        console.error('Error updating loed:', error);
        res.status(500).send('Server Error');
    }
});

// DELETE a loed
loedRouter.delete("/deleteloed/:id", async (req, res) => {
    try {
        const loedId = parseInt(req.params.id);
        const deletedLoed = await loed.destroy({
            where: { loed_id: loedId }
        });
        if (deletedLoed) {
            res.send('Loed deleted successfully');
        } else {
            res.status(404).send('Loed not found');
        }
    } catch (error) {
        console.error('Error deleting loed:', error);
        if (error.name === 'SequelizeForeignKeyConstraintError') {
            res.status(409).send('ไม่สามารถลบข้อมูลนี้ได้ขณะนี้เนื่องจากมีการใช้ข้อมูลนี้ในระบบ.' );
        } else {
            res.status(500).send('Server Error');
        }
    }
});

module.exports = loedRouter;