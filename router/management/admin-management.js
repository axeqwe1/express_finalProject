const express = require('express');
const sequelize = require('../../db/config/sequelizeConfig');
const admin = require('../../db/model/admin')(sequelize);
const adminRouter = express.Router();
const { checkDuplicatesEmailPhone, checkDuplicatesName } = require('../../utils/validation');
// GET all admins
adminRouter.get("/getadmins", async (req, res) => {
    try {
        const admins = await admin.findAll();
        res.json(admins);
    } catch (error) {
        console.error('Error fetching admins:', error);
        res.status(500).send('Server Error');
    }
});

// GET admin by ID
adminRouter.get("/getadmin/:id", async (req, res) => {
    try {
        const adminId = parseInt(req.params.id);
        const adminData = await admin.findByPk(adminId);
        if (adminData) {
            res.json(adminData);
        } else {
            res.status(404).send('Admin not found');
        }
    } catch (error) {
        console.error('Error fetching admin:', error);
        res.status(500).send('Server Error');
    }
});

// POST new admin
adminRouter.post("/addadmin", async (req, res) => {
    const {firstname,lastname,phone,email} = req.body
    try {
        if (await checkDuplicatesEmailPhone(email,phone)){
            return res.status(400).send('Email หรือ เบอร์โทร มีอยู่ในระบบแล้ว')
        }
        if(await checkDuplicatesName(firstname,lastname)){
            return res.status(400).send('ชื่อ-นามสกุล มีอยู่ในระบบแล้ว')
        }
        const newAdmin = await admin.create(req.body);
        res.status(201).json(newAdmin);
    } catch (error) {
        console.error('Error adding admin:', error);
        res.status(500).send('Server Error');
    }
});

// PUT update admin
adminRouter.put("/updateadmin/:id", async (req, res) => {
    const {firstname,lastname,phone,email} = req.body
    try {
        //เป็นการตรวจสอบว่าในrequestมีข้อมูล email หรือ phone หรือเปล่า ถ้าส่งเป็น undifine จะไม่ทำการตรวจสอบข้อมูลซ้ำ
        if(phone || email){
            if (await checkDuplicatesEmailPhone(email,phone)){
                return res.status(400).send('Email หรือ เบอร์โทร มีอยู่ในระบบแล้ว')
            }
        }
        if(firstname || lastname){
            if(await checkDuplicatesName(firstname,lastname)){
                return res.status(400).send('ชื่อ-นามสกุล มีอยู่ในระบบแล้ว')
            }
        }
        const adminId = parseInt(req.params.id);
        const updatedAdmin = await admin.update(req.body, {
            where: { admin_id: adminId }
        });
        if (updatedAdmin[0] > 0) {
            res.send('Admin updated successfully');
        } else {
            res.status(404).send('Admin not found');
        }
    } catch (error) {
        console.error('Error updating admin:', error);
        res.status(500).send('Server Error');
    }
});

// DELETE an admin
adminRouter.delete("/deleteadmin/:id", async (req, res) => {
    try {
        const adminId = parseInt(req.params.id);
        const deletedAdmin = await admin.destroy({
            where: { admin_id: adminId }
        });
        if (deletedAdmin) {
            res.send('Admin deleted successfully');
        } else {
            res.status(404).send('Admin not found');
        }
    } catch (error) {
        console.error('Error deleting admin:', error);
        res.status(500).send('Server Error');
    }
});

module.exports = adminRouter;