const db = require('./associatation')
const connectAndCreateDb = () => {
  try{
    // await db.sequelize.sync(); 
    db.sequelize.authenticate() // เป็น function สำหรับการทดสอบเชื่อมต่อ Database
    db.sequelize.sync() // จะทำการสร้าง table ตาม model ที่สร้างไว้ แต่ถ้ามีอยู่แล้วก็จะไม่ทำอะไร
    // db.sequelize.sync({force:true});  // ทำการ force ลบ Data ทุกๆ table
    console.log('Connection has been established successfully.');
  }catch(err){
    console.error('Unable to connect to the database:', error);
  } 
}

module.exports = {connectAndCreateDb}