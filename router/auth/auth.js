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
                req.session.user = {
                    userId  :user.id,
                    user    :user.email,
                    role    :user.role,
                    IsLogin :true
                }
                console.log(user.role)
                const userSession = req.session.user
                const sessionId = req.session
                return res.json({ message: "Logged in successfully!", userSession , user ,sessionId:sessionId.id });
            }
        }
        return res.json({ message: "User not found" }).status(404);
    } 
    catch (error) {
        res.status(500).json({message:error});
    }
});
router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ message: "Failed to logout" });
        }
        res.clearCookie('connect.sid');
        res.json({ message: "Logged out successfully" });
    });
});
// router.get('/protected', (req, res) => {
//     if (req.session.user) {
//         res.status(200).json({message:"Access granted"});
//     } else {
//         res.status(401).json({message:"Unauthorized"});
//     }
// });

// .get('/get-user-data', (req, res) => {
//     if (req.session && req.session.user) {
//         res.json({ status: 'success', userData: req.session.user });
//     } else {
//         res.status(401).json({ status: 'error', message: 'Session not valid' });
//     }
// });
function ensureAuthenticated(req, res, next) {
    if (req.session && req.session.user) {
        next();
    } else {
        res.status(401).json({ error: "Unauthorized" });
    }
}
module.exports = router;
