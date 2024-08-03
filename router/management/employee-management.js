const express = require('express');
const sequelize = require('../../db/config/sequelizeConfig');
const employee = require('../../db/model/employee')(sequelize); // Assuming this represents an employee model
const employeeRouter = express.Router();
const { checkDuplicatesEmailPhone, checkDuplicatesName } = require('../../utils/validation');
// GET all employees
employeeRouter.get("/getemployees", async (req, res) => {
    try {
        const employees = await employee.findAll();
        res.json(employees);
    } catch (error) {
        console.error('Error fetching employees:', error);
        res.status(500).send('Server Error');
    }
});

// GET an employee by ID
employeeRouter.get("/getemployee/:id", async (req, res) => {
    try {
        const employeeId = parseInt(req.params.id);
        const employeeData = await employee.findByPk(employeeId);
        if (employeeData) {
            res.json(employeeData);
        } else {
            res.status(404).send('Employee not found');
        }
    } catch (error) {
        console.error('Error fetching employee:', error);
        res.status(500).send('Server Error');
    }
});

// POST a new employee
employeeRouter.post("/addemployee", async (req, res) => {
    const {firstname,lastname,phone,email} = req.body
    try {
        if (await checkDuplicatesEmailPhone(email,phone)){
            return res.status(400).send('Email หรือ เบอร์โทร มีอยู่ในระบบแล้ว')
        }
        if(await checkDuplicatesName(firstname,lastname)){
            return res.status(400).send('ชื่อ-นามสกุล มีอยู่ในระบบแล้ว')
        }
        const newEmployee = await employee.create(req.body);
        res.status(201).json(newEmployee);
    } catch (error) {
        console.error('Error adding employee:', error);
        res.status(500).send('Server Error');
    }
});

// PUT to update an employee
employeeRouter.put("/updateemployee/:id", async (req, res) => {
    const {firstname,lastname,phone,email} = req.body
    try {
        const employeeId = parseInt(req.params.id);
        const updatedEmployee = await employee.update(req.body, {
            where: { emp_id: employeeId }
        });
        if (updatedEmployee[0] > 0) {
            res.send('Employee updated successfully');
        } else {
            // res.status(404).send('ข้อมูลแก้ไขซ้ำกับข้อมูลเก่าหรือไม่พบข้อมูลของผู้แก้ไขข้อมูล');
        }
    } catch (error) {
        console.error('Error updating employee:', error);
        res.status(500).send('Server Error');
    }
});

// DELETE an employee
employeeRouter.delete("/deleteemployee/:id", async (req, res) => {
    try {
        const employeeId = parseInt(req.params.id);
        const deletedEmployee = await employee.destroy({
            where: { emp_id: employeeId }
        });
        if (deletedEmployee) {
            res.status(202).send({message:'Employee deleted successfully'});
        } else {
            res.status(404).send({error:'Employee not found'});
        }
    } catch (error) {
        console.error('Error deleting employee:', error);
        res.status(500).send('Server Error');
    }
});

module.exports = employeeRouter;
