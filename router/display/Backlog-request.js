const express = require('express');
const router = express.Router();
const model = require('../../db/associatation');
const { Sequelize } = require('sequelize');

router.get('/backlog-request-list',async (req,res) => {
    try{
        const currentTime = new Date()
        const timerequest = await model.requestForRepair.findAll({
            include:[
                {
                    model:model.receiveRepair,
                    required:false ,
                    attributes:[]
                }
            ],
            where:Sequelize.literal(`NOT EXISTS (
                SELECT * FROM receive_repair WHERE receive_repair.rrid = request_for_repair.rrid
            )`)
        })
        const overdueRequest = timerequest.filter(timerequest => {
            const requestTime = new Date(timerequest.timestamp)
            const differenceInTime = currentTime - requestTime;
            const differenceInDays = differenceInTime / (1000 * 3600 * 24)
            return Math.floor(differenceInDays) >= 3
        })
        // if(!timerequest){
        //     console.log(timerequest)
        // }
        // console.log(arrTime)
        return res.send({data:overdueRequest})
    }
    catch(err){
        return res.send(err)
    }
})

module.exports = router