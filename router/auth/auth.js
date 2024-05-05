const express = require('express');
const model = require('../../db/associatation');
const { Op } = require('sequelize');
const router = express.Router();
// Login
router.post('/login', async (req, res) => {
    const tables = [
        { model: model.admin, role: 'Admin',id:null },
        { model: model.employee, role: 'Employee',id:null },
        { model: model.technician, role: 'Technician',id:null },
        { model: model.chief, role: 'Chief',id:null }
    ];
    const { email, password } = req.body;
    try {
        for (let item of tables){
            let user = await item.model.findOne({ where: { [Op.and]: [{ email: email }, { password: password }] } });
            if (user) {
                user.role = item.role
                if(user.emp_id) item.id = user.emp_id
                if(user.admin_id) item.id = user.admin_id
                if(user.tech_id) item.id = user.tech_id
                if(user.chief_id) item.id = user.chief_id
                user.id = item.id
                console.log(user.id)
                req.session.user = {
                    userId  :user.id,
                    user    :user.email,
                    role    :user.role,
                    IsLogin :true
                }
                console.log(user.role)
                return res.send({ message: "Logged in successfully!", user, });
            }
        }
        return res.status(404).send({ message: "User not found" });
    } 
    catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;
