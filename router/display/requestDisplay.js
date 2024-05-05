const express = require('express');
const model = require('../../db/associatation');
const { Op, Sequelize } = require('sequelize');

const router = express.Router();

router.get('/request-list',async (req,res)=>{
    try
    {
        console.log(req.sessionID)
        console.log("role ::::::",req.session.user.role)
        if(req.session.user.role == "Admin"){
            const result = await model.requestForRepair.findAll();
            return res.send(result)
        }
        else if (req.session.user.role == "Employee"){
            const result = await model.requestForRepair.findAll({
                where: {employee_id:req.session.user.userId}
            });
            return res.send(result)
        }
        else if (req.session.user.role == "Technician"){
            // SELECT receive_repair.*
            //        request_for_repair.*
            //        assignWork.*
            // FROM   receive_repair
            // JOIN   requestForRepair ON receive_repair.rrid = request_for_repair.rrid
            // JOIN   assignWork ON receive_repair.rrce_id = assignWork.rrce_id
            // WHERE  receive_repair.tech_id = req.session.user.userId AND
            //        request_for_repair.rrid = receive_repair.rrid AND
            //        assignWork.rrce_id = receive_repair.rrce_id
            const result = await model.receiveRepair.findAll({
                where:{tech_id:req.session.user.userId},
                include: [{
                    model:model.requestForRepair,
                    required:true, // เป็นการกำหนดว่าทำการ Join
                    where:{
                        rrid:Sequelize.col('receive_repair.rrid'),
                    },
                    include:[{
                        required:true,
                        model:model.assignWork,
                        where:{rrce_id:Sequelize.col('receive_repair.rrce_id')}
                    }]
                }]
            })
            return res.send({message:'Login Success' , data:result})
        }
        else{
            res.send({message:'ข้อมูลผู้ใช้งานไม่ถูกต้อง'})
        } 
    }
    catch(err)
    {
        console.log(err)
        res.send({message:err})
    }
})
router.get('/request/:id',async (req,res) => {
    try{

    }catch(err)
    {

    }
})

module.exports = router