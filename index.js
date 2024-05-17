// index.js
const express = require("express");
const cors = require('cors');
const app = express();
const sessionConfig = require('./config/session.config.js');
const port = 8000;
const { parse } = require('json2csv');
const { connectAndCreateDb } = require('./db/index.js')
const router = require('./router/root-router.js')


app.use(express.json());
app.use(cors())
sessionConfig(app);
// Management User routes
app.use('/managementuser', router.management.admin)
app.use('/managementuser', router.management.employee)
app.use('/managementuser', router.management.technician)
app.use('/managementuser', router.management.chief)

// Management Data routes
app.use('/managementdata', router.management.building)
app.use('/managementdata', router.management.department)
app.use('/managementdata', router.management.equipment)
app.use('/managementdata', router.management.equipmentType)
app.use('/managementdata', router.management.levelOfDamage)
app.use('/managementdata', router.management.technicianStatus)

// Action routes
app.use('/action', router.action.requestForRepair)
app.use('/action', router.action.assignWork)
app.use('/action', router.action.repairDetail)
// manage image
app.use('/manageImg',router.manageimage.getlistImage)
app.use('/images',express.static('images'))
app.use('/images',router.upload.uploadImage)
// auth
app.use('/auth',router.auth.auth)
// display
app.use('/display',router.display.requestDisplay)
app.use('/display',router.display.technicianForAssign)
app.use('/display',router.display.backlogRequest)
app.use('/display',router.display.notificationDisplay)
// search
app.use('/search',router.search.searchRequest)
app.use('/search',router.search.searchEquipment)
// report
app.use('/report',router.reports.export_report)
// Example endpoint to check session data

app.get('/download-csv', (req, res) => {
  const data = [
      { id: 1, firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com' },
      { id: 2, firstName: 'Jane', lastName: 'Doe', email: 'jane.doe@example.com' }
  ];
  const fields = [
      { label: 'ID', value: 'id' },
      { label: 'First Name', value: 'firstName' },
      { label: 'Last Name', value: 'lastName' },
      { label: 'Email', value: 'email' }
  ];
  const opts = { fields };
  const csv = parse(data, opts);

  res.header('Content-Type', 'text/csv');
  res.attachment('filename.csv');
  res.send(csv);
});

app.get('/check-session', (req, res) => {
  res.send({ sessionData: req.session, sessionID: req.sessionID });
});
app.listen(port, async () => {
  await connectAndCreateDb()
  console.log("Server started at port 8000");
});