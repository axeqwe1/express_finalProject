const express = require('express');
const sequelize = require('../../db/config/sequelizeConfig');
const techStatus = require('../../db/model/technician_status')(sequelize);
const techStatusRouter = express.Router();

// GET all technicians
techStatusRouter.get("/gettechstatus", async (req, res) => {
    try {
        const technicians = await techStatus.findAll();
        res.json(technicians);
    } catch (error) {
        console.error('Error fetching technicians:', error);
        res.status(500).send('Server Error');
    }
}); 

// GET technician by ID
techStatusRouter.get("/gettechstatus/:id", async (req, res) => {
    try {
        const status_id = parseInt(req.params.id);
        const technicianData = await techStatus.findByPk(status_id);
        if (technicianData) {
            res.json(technicianData);
        } else {
            res.status(404).send('Technician not found');
        }
    } catch (error) {
        console.error('Error fetching technician:', error);
        res.status(500).send('Server Error');
    }
});

// POST new technician
techStatusRouter.post("/addtechstatus", async (req, res) => {
    try {
        const newTechnician = await techStatus.create(req.body);
        res.status(201).json(newTechnician);
    } catch (error) {
        console.error('Error adding technician:', error);
        res.status(500).send('Server Error');
    }
});

// PUT update technician
techStatusRouter.put("/updatetechstatus/:id", async (req, res) => {
    try {
        const status_id = parseInt(req.params.id);
        const updatedTechnician = await techStatus.update(req.body, {
            where: { status_id: status_id }
        });
        if (updatedTechnician[0] > 0) {
            res.send('Technician updated successfully');
        } else {

        }
    } catch (error) {
        console.error('Error updating technician:', error);
        res.status(500).send('Server Error');
    }
});

// DELETE a technician
techStatusRouter.delete("/deletetechstatus/:id", async (req, res) => {
    try {
        const status_id = parseInt(req.params.id);
        const deletedTechnician = await techStatus.destroy({
            where: { status_id: status_id }
        });
        if (deletedTechnician) {
            res.send('Technician deleted successfully');
        } else {
            res.status(404).send('Technician not found');
        }
    } catch (error) {
        console.error('Error deleting technician:', error);
        if (error.name === 'SequelizeForeignKeyConstraintError') {
            res.status(409).send('ไม่สามารถลบข้อมูลนี้ได้ขณะนี้เนื่องจากมีการใช้ข้อมูลนี้ในระบบ.' );
        } else {
            res.status(500).send('Server Error');
        }
    }
});

module.exports = techStatusRouter;