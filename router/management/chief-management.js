const express = require('express');
const sequelize = require('../../db/config/sequelizeConfig');
const chief = require('../../db/model/chief')(sequelize);
const chiefRouter = express.Router();
const { checkDuplicatesEmailPhone, checkDuplicatesName } = require('../../utils/validation');
const {sendCreateEmail,sendUpdateEmail} = require('../../utils/Mailer')
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
    const {firstname,lastname,phone,email,password} = req.body
    try {
        if (await checkDuplicatesEmailPhone(email,phone)){
            return res.status(400).send('Email หรือ เบอร์โทร มีอยู่ในระบบแล้ว')
        }
        if(await checkDuplicatesName(firstname,lastname)){
            return res.status(400).send('ชื่อ-นามสกุล มีอยู่ในระบบแล้ว')
        }
        const newChief = await chief.create(req.body);
        sendCreateEmail(email,`${firstname} ${lastname}`,password)
        res.status(201).json(newChief);
    } catch (error) {
        console.error('Error adding chief:', error);
        res.status(500).send('Server Error');
    }
});

// PUT update chief
chiefRouter.put("/updatechief/:id", async (req, res) => {
    const {firstname,lastname,phone,email,password} = req.body
    try {
        const chiefId = parseInt(req.params.id);
        const updatedChief = await chief.update(req.body, {
            where: { chief_id: chiefId }
        });
        sendUpdateEmail(email,`${firstname} ${lastname}`,password)
        res.send('Technician updated successfully');
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

        if (error.name === 'SequelizeForeignKeyConstraintError') {
            res.status(409).send('ไม่สามารถลบข้อมูลนี้ได้ขณะนี้เนื่องจากมีการใช้ข้อมูลนี้ในระบบ.' );
        } else {
            res.status(500).send('Server Error');
        }
    }
});

module.exports = chiefRouter;
