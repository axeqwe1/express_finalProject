const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();
// สร้างการตั้งค่า Transporter สำหรับการเชื่อมต่อ SMTP
const transporter = nodemailer.createTransport({
  service: 'gmail', // ใช้ Gmail, สามารถเปลี่ยนเป็น 'hotmail', 'outlook' หรือ SMTP ของคุณ
  auth: {
    user: 'shuffer2543@gmail.com', // อีเมลของคุณ
    pass: 'bzpj dngj wrgs ytag'   // รหัสผ่านหรือ App Password (สำหรับ Gmail ใช้ App Password)
  }
});

// ฟังก์ชันสำหรับส่งอีเมล
async function sendCreateEmail(userEmail, username, password) {
    try {
      // กำหนดข้อมูลการส่งอีเมล
      const mailOptions = {
        from: 'your-email@gmail.com',
        to: userEmail,
        subject: 'Welcome to Our Service',
        text: `Hello ${username},\n\nYour account has been created successfully.\n\nUsername: ${userEmail}\nPassword: ${password}\n\nPlease keep your credentials secure.\n\nThank you!`,
        html: `<h1>Welcome, ${username}!</h1><p>Your account has been created successfully.</p><p><strong>Username:</strong> ${userEmail}<br><strong>Password:</strong> ${password}</p><p>Please keep your credentials secure.</p><p>Thank you!</p>`
      };
  
      // ส่งอีเมล
      await transporter.sendMail(mailOptions);
      console.log('Email sent successfully!');
    } catch (error) {
      console.error('Error sending email:', error);
  
      // ตรวจสอบข้อผิดพลาดที่เกิดขึ้น
      if (error.responseCode === 550) {
        console.error('The recipient email address does not exist.');
      } else {
        console.error('An unknown error occurred:', error.message);
      }
    }
  }

  async function sendUpdateEmail(userEmail, username, password) {
    try {
      // กำหนดข้อมูลการส่งอีเมล
      const mailOptions = {
        from: 'your-email@gmail.com',
        to: userEmail,
        subject: 'Welcome to Our Service',
        text: `Hello ${username},\n\nYour account has been created successfully.\n\nUsername: ${userEmail}\nPassword: ${password}\n\nPlease keep your credentials secure.\n\nThank you!`,
        html: `<h1>Welcome, ${username}!</h1><p>Your account has been Updated successfully.</p><p><strong>Username:</strong> ${userEmail}<br><strong>Password:</strong> ${password}</p><p>Please keep your credentials secure.</p><p>Thank you!</p>`
      };
  
      // ส่งอีเมล
      await transporter.sendMail(mailOptions);
      console.log('Email sent successfully!');
    } catch (error) {
      console.error('Error sending email:', error);
  
      // ตรวจสอบข้อผิดพลาดที่เกิดขึ้น
      if (error.responseCode === 550) {
        console.error('The recipient email address does not exist.');
      } else {
        console.error('An unknown error occurred:', error.message);
      }
    }
  }
// // เรียกใช้ฟังก์ชันเมื่อผู้ใช้สมัครสำเร็จ
// async function addUser(req, res) {
//   try {
//     const { username, email, password } = req.body;

//     // เพิ่มข้อมูลผู้ใช้ในฐานข้อมูล (ใส่โค้ดการบันทึกข้อมูลลงฐานข้อมูลของคุณที่นี่)

//     // ส่งอีเมลยืนยันการสมัคร
//     await sendCreateEmail(email, username, password);

//     res.status(201).send('User added and email sent successfully!');
//   } catch (error) {
//     res.status(500).send('Error adding user or sending email');
//   }
// }

// router.post('/testMail',addUser)

module.exports = {sendCreateEmail,sendUpdateEmail}