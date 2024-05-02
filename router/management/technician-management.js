const express = require('express');
const sequelize = require('../../db/sequelizeConfig');
const technic = require('../../db/model/technician')(sequelize);
const technicRouter = express.Router();

// GET all technicians
technicRouter.get("/gettechnicians", async (req, res) => {
    try {
        const technicians = await technic.findAll();
        res.json(technicians);
    } catch (error) {
        console.error('Error fetching technicians:', error);
        res.status(500).send('Server Error');
    }
}); 

// GET technician by ID
technicRouter.get("/gettechnician/:id", async (req, res) => {
    try {
        const technicianId = parseInt(req.params.id);
        const technicianData = await technic.findByPk(technicianId);
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
technicRouter.post("/addtechnician", async (req, res) => {
    try {
        const newTechnician = await technic.create(req.body);
        res.status(201).json(newTechnician);
    } catch (error) {
        console.error('Error adding technician:', error);
        res.status(500).send('Server Error');
    }
});

// PUT update technician
technicRouter.put("/updatetechnician/:id", async (req, res) => {
    try {
        const technicianId = parseInt(req.params.id);
        const updatedTechnician = await technic.update(req.body, {
            where: { technician_id: technicianId }
        });
        if (updatedTechnician[0] > 0) {
            res.send('Technician updated successfully');
        } else {
            res.status(404).send('Technician not found');
        }
    } catch (error) {
        console.error('Error updating technician:', error);
        res.status(500).send('Server Error');
    }
});

// DELETE a technician
technicRouter.delete("/deletetechnician/:id", async (req, res) => {
    try {
        const technicianId = parseInt(req.params.id);
        const deletedTechnician = await technic.destroy({
            where: { technician_id: technicianId }
        });
        if (deletedTechnician) {
            res.send('Technician deleted successfully');
        } else {
            res.status(404).send('Technician not found');
        }
    } catch (error) {
        console.error('Error deleting technician:', error);
        res.status(500).send('Server Error');
    }
});

module.exports = technicRouter;