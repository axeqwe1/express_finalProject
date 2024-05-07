const express = require('express');
const router = express.Router();
const model = require('../../db/associatation');
const {Sequelize} = require('sequelize');

router.get('/techReceive/:id', async (req,res) => {
    const techId = parseInt(req.params.id)
    let totalCount = 0
    let succCount = 0
    try{
        // SELECT COUNT(`receive_repair`.`rrid`) AS `receive` FROM `receive_repair` AS `receive_repair` WHERE `receive_repair`.`tech_id` = 2;
        const count = await model.receiveRepair.findAll({
            where:{tech_id:techId},
            attributes:[[Sequelize.fn('COUNT',Sequelize.col('receive_repair.rrid')),'receive']]
        })
        // SELECT 
        //     COUNT(`request_for_repair`.`rrid`) AS `successWork` 
        // FROM 
        //     `request_for_repair` AS `request_for_repair` 
        // INNER JOIN 
        //     `receive_repair` AS `receive_repair` 
        //     ON `request_for_repair`.`rrid` = `receive_repair`.`rrid` 
        //     AND `receive_repair`.`tech_id` = 1 
        // WHERE 
        //     `request_for_repair`.`request_status` = 'success' 
        // GROUP BY 
        //     `receive_repair`.`tech_id`;
        const successCount = await model.requestForRepair.findAll({
            where:{
                request_status:'success'
            },
            include:[{
                model:model.receiveRepair,
                required:true,
                where:{tech_id:techId},
                attributes:[]
            }],
            attributes:[
                [Sequelize.fn('COUNT',Sequelize.col('request_for_repair.rrid')),'successWork'],
            ],
            group:[`receive_repair.tech_id`]
        })
        
        // ตรวจข้อมูลใน array ว่ามีข้อมูลหรือเปล่า --> จำนวนงานทั้งหมด
        if(!count[0]){
             totalCount = 0
        }else{
             totalCount = parseInt(count[0].dataValues.receive)
        }
        // ตรวจข้อมูลใน array ว่ามีข้อมูลหรือเปล่า --> จำนวนงานที่ทำเสร็จ
        if(!successCount[0]){
             succCount = 0
        }else{
             succCount = parseInt(successCount[0].dataValues.successWork)
        }

        const Backlog = totalCount - succCount
        // SELECT 
        //     `receive_repair`.`tech_id`, 
        //     `technician`.`tech_id` AS `technician.tech_id`, 
        //     `technician`.`firstname` AS `technician.firstname`, 
        //     `technician`.`lastname` AS `technician.lastname`, 
        //     `technician`.`phone` AS `technician.phone`, 
        //     `technician`.`email` AS `technician.email`, 
        //     `technician`.`department_id` AS `technician.departmentId`, 
        //     `technician`.`status_id` AS `technician.status_id`, 
        //     `technician->technicianStatus`.`status_id` AS `technician.technicianStatus.status_id`, 
        //     `technician->technicianStatus`.`receive_request_status` AS `technician.technicianStatus.receive_request_status` 
        // FROM 
        //     `receive_repair` AS `receive_repair` 
        // INNER JOIN 
        //     `technicians` AS `technician` 
        //     ON `receive_repair`.`tech_id` = `technician`.`tech_id` 
        // INNER JOIN 
        //     `technician_status` AS `technician->technicianStatus` 
        //     ON `technician`.`status_id` = `technician->technicianStatus`.`status_id` 
        // WHERE 
        //     `receive_repair`.`tech_id` = 1 
        // GROUP BY 
        //     `receive_repair`.`tech_id`,`technician.firstname`,`technician.lastname`;
        const technicianData = await model.receiveRepair.findAll({
            where:{tech_id:techId},
            include:[{
                model:model.technician,
                required:true,
                attributes:['firstname','lastname','phone','email','departmentId'],
                include:[{
                    model:model.technicianStatus,
                    required:true,
                    attributes:['receive_request_status']
                }]
            }],
            attributes: ['tech_id'],
            group: ['technician.tech_id',`technician.firstname`,`technician.lastname`]
        })
        if(!technicianData[0]){
            const techData = await model.technician.findOne({
                where:{tech_id:techId},
                include:[{
                    required:true,
                    model:model.technicianStatus,
                    attributes:['receive_request_status']
                }]
            })
            return res.send({Backlog:Backlog,SuccessWork:succCount,TotalWork:totalCount,Message:'ช่างคนนี้ไม่เคยรับงาน',data:techData,});
        }
        return res.send({Backlog:Backlog,SuccessWork:succCount,TotalWork:totalCount,data:technicianData});
        // return res.json({successCount});
    }
    catch(err){
        return res.status(500).json({ error: err.message });
    }
})

module.exports = router