const express = require('express');
const sequelize = require('../../db/sequelizeConfig');
const department = require('../../db/model/building')(sequelize); // Assuming the model name is for buildings, but used under department alias
const departmentRouter = express.Router();

// GET all buildings
departmentRouter.get("/getdepartments", async (req, res) => {
    try {
        const buildings = await department.findAll();
        res.json(buildings);
    } catch (error) {
        console.error('Error fetching buildings:', error);
        res.status(500).send('Server Error');
    }
});

// GET building by ID
departmentRouter.get("/getdepartment/:id", async (req, res) => {
    try {
        const buildingId = parseInt(req.params.id);
        const buildingData = await department.findByPk(buildingId);  // Changed to 'department' to match the defined variable
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
departmentRouter.post("/adddepartment", async (req, res) => {
    try {
        const newBuilding = await department.create(req.body);  // Changed to 'department' to match the defined variable
        res.status(201).json(newBuilding);
    } catch (error) {
        console.error('Error adding building:', error);
        res.status(500).send('Server Error');
    }
});

// PUT update building
departmentRouter.put("/updatedepartment/:id", async (req, res) => {
    try {
        const buildingId = parseInt(req.params.id);
        const updatedBuilding = await department.update(req.body, { // Changed to 'department' to match the defined variable
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
departmentRouter.delete("/deletedepartment/:id", async (req, res) => {
    try {
        const buildingId = parseInt(req.params.id);
        const deletedBuilding = await department.destroy({ // Changed to 'department' to match the defined variable
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

module.exports = departmentRouter; // Changed to 'departmentRouter' to match the defined router variable
