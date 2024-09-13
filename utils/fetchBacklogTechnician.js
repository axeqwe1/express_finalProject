const express = require('express');
// การนำเข้าโมเดลจากไฟล์โมเดลแต่ละไฟล์โดยตรง
const model = require('../db/associatation')
const {Sequelize} = require('sequelize');

const fetchBacklogTech = async (techId) =>{
    // fetch จำนวนการรับงาน
    const count = await model.receiveRepair.findAll({
      where:{tech_id:techId},
      attributes:[[Sequelize.fn('COUNT',Sequelize.col('receive_repair.rrid')),'receive']]
  })

    const successCount = await model.requestForRepair.findAll({
      where:{
          request_status:'ส่งคืนเสร็จสิ้น'
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

    return Backlog
}

module.exports = {fetchBacklogTech};