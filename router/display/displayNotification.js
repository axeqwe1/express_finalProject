const express = require('express')
const router = express.Router()
const model = require('../../db/associatation')


router.get('/notification/:role/:id', async (req, res) => {
    const userId = req.params.id;
    const role = req.params.role;
    try {
        let result;
        if (role === "Admin") {
            result = await model.notification.findAll({
                where: { admin_id: userId },
                order: [['timestamp', 'DESC']] // จัดเรียงตามวันที่ใหม่ล่าสุด
            });
        } else if (role === "Technician") {
            result = await model.notification.findAll({
                where: { tech_id: userId },
                order: [['timestamp', 'DESC']]
            });
        } else if (role === "Employee") {
            result = await model.notification.findAll({
                where: { emp_id: userId },
                order: [['timestamp', 'DESC']]
            });
        } else {
            return res.status(404).json("Not Found User");
        }

        return res.status(200).json({ data: result });
    } catch (err) {
        return res.status(500).send(`Error to fetch notification: ${err}`);
    }
});
// อัปเดตสถานะการอ่านแจ้งเตือนสำหรับผู้ใช้เฉพาะคน
router.post('/notifications/markAsRead', async (req, res) => {
    const { userId, role } = req.body;

    try {
        let updateCondition = {};

        // ตรวจสอบ role เพื่อสร้างเงื่อนไขการอัปเดต
        if (role === "Admin") {
            updateCondition = { admin_id: userId, isRead: false };
        } else if (role === "Technician") {
            updateCondition = { tech_id: userId, isRead: false };
        } else if (role === "Employee") {
            updateCondition = { emp_id: userId, isRead: false };
        } else {
            return res.status(400).json({ error: 'Invalid user role' });
        }

        // อัปเดตสถานะการอ่านเฉพาะแจ้งเตือนของผู้ใช้
        await model.notification.update(
            { isRead: true }, 
            { where: updateCondition }
        );

        res.status(200).send({ message: 'Notifications marked as read' });
    } catch (error) {
        console.error('Error marking notifications as read:', error);
        res.status(500).send('Server Error');
    }
});
module.exports = router