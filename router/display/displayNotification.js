const express = require('express')
const router = express.Router()
const model = require('../../db/associatation')


router.get('/notification/:role/:id',async (req,res) => {
    const userId = req.params.id
    const role = req.params.role
    try{
        if(role == "Admin"){
            const result = await model.notification.findAll({
                where: {admin_id:userId}
            })
            return res.status(200).json({data:result})
        }
        else if(role == "Technician"){
            const result = await model.notification.findAll({
                where: {tech_id:userId}
            })
            return res.status(200).json({data:result})
        }
        else if(role == "Employee"){
            const result = await model.notification.findAll({
                where: {emp_id:userId}
            })
            return res.status(200).json({data:result})
        }
        else{
            return res.status(404).json("Not Found User")
        }
    }
    catch(err){
        return res.status(500).send(`err to fetch notification:${err}`)
    }

})

module.exports = router