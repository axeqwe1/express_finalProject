const express = require('express');
const model = require('../../db/associatation');
const { Op, Sequelize } = require('sequelize');

const router = express.Router();

router.get('/request-list/:role/:id',async (req,res)=>{
    const role = req.params.role
    const id = req.params.id
    try
    {
        if(role == "Admin"){
            const result = await model.requestForRepair.findAll({
                include:[
                    {
                        model:model.receiveRepair
                    },
                    {
                        model:model.assignWork
                    },
                    {
                        required:true,
                        model:model.employee,
                    },
                    {
                        required:true,
                        model:model.building
                    },
                    {
                        required:true,
                        model:model.equipment
                    }
                ]
            });
            return res.status(200).json({message:'Login Success' , data:result})
        }
        else if (role == "Employee"){
            const result = await model.requestForRepair.findAll({
                include:[
                    {
                        model:model.receiveRepair
                    },
                    {
                        model:model.assignWork
                    },
                    {
                        required:true,
                        model:model.employee,
                    },
                    {
                        required:true,
                        model:model.building
                    },
                    {
                        required:true,
                        model:model.equipment
                    }
                ],
                where: {employee_id:id}
            });
            return res.status(200).json({message:'Login Success' , data:result})
        }
        else if (role == "Technician"){
            // SELECT *
            // FROM   `request_for_repair`
            // JOIN   `receive_repair` ON `request_for_repair`.`rrid` = `receive_repair`.`rrid`
            // JOIN   `assign_work` ON `request_for_repair`.`rrid` = `assign_work`.`rrid`
            // WHERE  `receive_repair`.`tech_id` = 3 AND
            //        `receive_repair`.`rrid` = `request_for_repair`.`rrid` AND
            //        `assign_work`.`rrid` = `receive_repair`.`rrid`;
            const result = await model.requestForRepair.findAll({
                include:[
                    {
                        required:true,
                        model:model.receiveRepair,
                        where:{
                            [Op.and]:[
                                {tech_id:id},
                                {rrid:Sequelize.col('request_for_repair.rrid')}
                            ]
                        },
                        include:[
                            {
                                model:model.repairDetail
                            }
                        ]
                    },
                    {
                        model:model.assignWork
                    },
                    {
                        required:true,
                        model:model.employee,
                    },
                    {
                        required:true,
                        model:model.building
                    },
                    {
                        required:true,
                        model:model.equipment
                    }
                ],
            })
            return res.status(200).json({message:'Login Success' , data:result})
        }
        else{
            res.status(400).json({message:'ข้อมูลผู้ใช้งานไม่ถูกต้อง'})
        } 
    }
    catch(err)
    {
        console.log(err)
        res.status(400).json({message:err})
    }
})
router.get('/request/:id',async (req,res) => {
    const rrid = parseInt(req.params.id)
    try
    {
        console.log(req.params.id)
        const checkReceive = await model.receiveRepair.findOne({where:{rrid:rrid}})
        if(checkReceive){
            // SELECT 
            //     `request_for_repair`.*, 
            //     `details`.`rd_id` AS `receive_repair.repair_details.rd_id`, 
            //     `details`.`loed_id` AS `receive_repair.repair_details.loed_id`, 
            //     `details`.`rrce_id` AS `receive_repair.repair_details.rrce_id`, 
            //     `details`.`rd_description` AS `receive_repair.repair_details.rd_description` 
            // FROM 
            //     (
            //         SELECT 
            //             `request_for_repair`.`rrid`, 
            //             `request_for_repair`.`rr_description`, 
            //             `request_for_repair`.`rr_picture`, 
            //             `request_for_repair`.`request_status`, 
            //             `request_for_repair`.`timestamp`, 
            //             `request_for_repair`.`employee_id`, 
            //             `request_for_repair`.`building_id`, 
            //             `request_for_repair`.`eq_id`, 
            //             `receive_repair`.`rrce_id` AS `receive_repair.rrce_id`, 
            //             `receive_repair`.`tech_id` AS `receive_repair.tech_id`, 
            //             `receive_repair`.`date_receive` AS `receive_repair.date_receive`, 
            //             `receive_repair`.`rrid` AS `receive_repair.rrid` 
            //         FROM 
            //             `request_for_repair` AS `request_for_repair` 
            //             INNER JOIN `receive_repair` AS `receive_repair` 
            //             ON `request_for_repair`.`rrid` = `receive_repair`.`rrid` 
            //             AND `receive_repair`.`rrid` = 15 
            //         LIMIT 1
            //     ) AS `request_for_repair` 
            // LEFT JOIN 
            //     `repair_details` AS `details` 
            // ON 
            //     `receive_repair.rrce_id` = `details`.`rrce_id`;
                const result = await model.requestForRepair.findOne({
                    include:[
                        {
                            required:true,
                            model:model.receiveRepair,
                            where:{rrid:rrid},
                            include:[
                                {
                                    model:model.repairDetail,
                                    include:[
                                        {
                                            model:model.levelOfDamage
                                        }
                                    ]
                                },
                                {
                                    model:model.technician
                                },
                            ]
                        },
                        {
                            model:model.equipment, 
                            include:[
                                {
                                    model:model.equipmentType,
                                    where:{eqc_id:Sequelize.col('eqc_id')}
                                }
                            ]
                        },
                        {
                            model:model.employee,
                        },
                        {
                            model:model.building
                        },
                        {
                            model:model.assignWork
                        }
                ]
                });
                return res.send(result)
        }else{
            const result = await model.requestForRepair.findOne({
                where:{rrid:rrid},
                include:[
                    {
                        model:model.equipment, 
                        include:[
                            {
                                model:model.equipmentType,
                            }
                        ]
                    },
                    {
                        model:model.employee,
                    },
                    {
                        model:model.building
                    }
                ]
            })
            if(result == null){
                return res.send({message:"ไม่มีข้อมูลในระบบ"})
            }
            return res.send(result)
        }
    }
    catch(err)
    {
        console.log(err)
        res.send({message:err})
    }
})

module.exports = router