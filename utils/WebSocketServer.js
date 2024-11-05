const WebSocket = require('ws');
const wss = new WebSocket.Server({
    port: 80,
    perMessageDeflate: false,  // ปิดการบีบอัด
});

wss.on('connection', (ws) => {
    console.log('Client connected');

    // เมื่อได้รับข้อความจาก client
    ws.on('message', (message) => {
        console.log('Received:', message);
        
        // ตอบกลับข้อความไปยัง client (echo message)
        ws.send(`Server received: ${message}`);
    });

    // จัดการกรณีเกิด error
    ws.on('error', (error) => {
        console.error('WebSocket error:', error);
    });

    // จัดการกรณีที่ client ปิดการเชื่อมต่อ
    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

module.exports = wss;