const { sequelize } = require('./associatation');
const connectAndCreateDb =  () => {
      sequelize.authenticate().then(() => { // เป็น function สำหรับการทดสอบเชื่อมต่อ Database
      console.log('Connection has been established successfully.');
      sequelize.sync()                         // จะทำการสร้าง table ตาม model ที่สร้างไว้ แต่ถ้ามีอยู่แล้วก็จะไม่ทำอะไร  
      // db.sequelize.sync({force:true});         // ทำการ force ลบ Data ทุกๆ table
    }).catch((err) => {
      console.error('Unable to connect to the database: ', err);
    }) 
    
}

module.exports = {connectAndCreateDb}