const express = require('express');
const sequelize = require('../../db/config/sequelizeConfig');
const department = require('../../db/model/department')(sequelize);
const departmentRouter = express.Router();

// GET all departments
departmentRouter.get("/getdepartments", async (req, res) => {
    try {
        const departments = await department.findAll();
        res.json(departments);
    } catch (error) {
        console.error('Error fetching departments:', error);
        res.status(500).send('Server Error');
    }
});

// GET department by ID
departmentRouter.get("/getdepartment/:id", async (req, res) => {
    try {
        const departmentId = parseInt(req.params.id);
        const departmentData = await department.findByPk(departmentId);
        if (departmentData) {
            res.json(departmentData);
        } else {
            res.status(404).send('Department not found');
        }
    } catch (error) {
        console.error('Error fetching department:', error);
        res.status(500).send('Server Error');
    }
});

// POST new department
departmentRouter.post("/adddepartment", async (req, res) => {
    try {
        const newDepartment = await department.create(req.body);
        res.status(201).json(newDepartment);
    } catch (error) {
        console.error('Error adding department:', error);
        res.status(500).send('Server Error');
    }
});

// PUT update department
departmentRouter.put("/updatedepartment/:id", async (req, res) => {
    try {
        const departmentId = parseInt(req.params.id);
        const updatedDepartment = await department.update(req.body, {
            where: { department_id: departmentId } // Make sure to use the correct column name for the department's ID.
        });
        res.send('Department updated successfully');
    } catch (error) {
        console.error('Error updating department:', error);
        res.status(500).send('Server Error');
    }
});

// DELETE a department
departmentRouter.delete("/deletedepartment/:id", async (req, res) => {
    try {
        const departmentId = parseInt(req.params.id);
        const deletedDepartment = await department.destroy({
            where: { department_id: departmentId } // Make sure to use the correct column name for the department's ID.
        });
        if (deletedDepartment) {
            res.send('Department deleted successfully');
        } else {
            res.status(404).send('Department not found');
        }
    } catch (error) {
        console.error('Error deleting department:', error);
        if (error.name === 'SequelizeForeignKeyConstraintError') {
            res.status(409).send('ไม่สามารถลบข้อมูลนี้ได้ขณะนี้เนื่องจากมีการใช้ข้อมูลนี้ในระบบ.' );
        } else {
            res.status(500).send('Server Error');
        }
    }
});

module.exports = departmentRouter;
