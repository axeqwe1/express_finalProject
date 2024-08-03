const express = require('express');
const sequelize = require('../../db/config/sequelizeConfig');
const chief = require('../../db/model/chief')(sequelize);
const chiefRouter = express.Router();
const { checkDuplicatesEmailPhone, checkDuplicatesName } = require('../../utils/validation');
// GET all chiefs
chiefRouter.get("/getchiefs", async (req, res) => {
    try {
        const chiefs = await chief.findAll();
        res.json(chiefs);
    } catch (error) {
        console.error('Error fetching chiefs:', error);
        res.status(500).send('Server Error');
    }
});

// GET chief by ID
chiefRouter.get("/getchief/:id", async (req, res) => {
    try {
        const chiefId = parseInt(req.params.id);
        const chiefData = await chief.findByPk(chiefId);
        if (chiefData) {
            res.json(chiefData);
        } else {
            res.status(404).send('Chief not found');
        }
    } catch (error) {
        console.error('Error fetching chief:', error);
        res.status(500).send('Server Error');
    }
});

// POST new chief
chiefRouter.post("/addchief", async (req, res) => {
    const {firstname,lastname,phone,email} = req.body
    try {
        if (await checkDuplicatesEmailPhone(email,phone)){
            return res.status(400).send('Email หรือ เบอร์โทร มีอยู่ในระบบแล้ว')
        }
        if(await checkDuplicatesName(firstname,lastname)){
            return res.status(400).send('ชื่อ-นามสกุล มีอยู่ในระบบแล้ว')
        }
        const newChief = await chief.create(req.body);
        res.status(201).json(newChief);
    } catch (error) {
        console.error('Error adding chief:', error);
        res.status(500).send('Server Error');
    }
});

// PUT update chief
chiefRouter.put("/updatechief/:id", async (req, res) => {
    const {firstname,lastname,phone,email} = req.body
    try {
        const chiefId = parseInt(req.params.id);
        const updatedChief = await chief.update(req.body, {
            where: { chief_id: chiefId }
        });
        if (updatedChief[0] > 0) {
            res.send('Chief updated successfully');
        } else {
            // res.status(404).send('ข้อมูลแก้ไขซ้ำกับข้อมูลเก่าหรือไม่พบข้อมูลของผู้แก้ไขข้อมูล');
        }
    } catch (error) {
        console.error('Error updating chief:', error);
        res.status(500).send('Server Error');
    }
});

// DELETE a chief
chiefRouter.delete("/deletechief/:id", async (req, res) => {
    try {
        const chiefId = parseInt(req.params.id);
        const deletedChief = await chief.destroy({
            where: { chief_id: chiefId }
        });
        if (deletedChief) {
            res.status(202).send({message:'Chief deleted successfully'});
        } else {
            res.status(404).send({message:'Chief not found'});
        }
    } catch (error) {
        console.error('Error deleting chief:', error);
        res.status(500).send('Server Error');
    }
});

module.exports = chiefRouter;
