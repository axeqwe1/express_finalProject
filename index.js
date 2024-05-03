const express = require("express");
const cors = require('cors');

const app = express();
const port = 8000;
const db = require('./db/index.js')
const connectDB = require('./db/connectDb.js')
const router = require('./router/root-router.js')
app.use(express.json());
app.use(cors())
//management user
app.use('/managementuser',router.management.admin)
app.use('/managementuser',router.management.employee)
app.use('/managementuser',router.management.technician)
app.use('/managementuser',router.management.chief)
//management Data
app.use('/managementdata',router.management.building)
app.use('/managementdata',router.management.department)
app.use('/managementdata',router.management.equipment)
app.use('/managementdata',router.management.equipmentType)
app.use('/managementdata',router.management.levelOfDamage)
app.use('/managementdata',router.management.technicianStatus)
// action
app.use('/action',router.action.requestForRepair)
app.use('/action',router.action.assignWork)

app.get('/test',(req,res) =>{
  res.send("test")
})
// Listen
app.listen(port, async () => {
    await connectDB;
    // await db.sequelize.sync({force:true});  // ทำการ force ลบ Data ทุกๆ table
    await db.sequelize.sync(); 
    // noti()
    console.log("Server started at port 8000");
  });