const WebSocket = require('ws');
const wss = new WebSocket.Server({
    port: 8001,
    host: '0.0.0.0', // ฟังทุกอินเตอร์เฟสเพื่อให้เข้าถึงได้จากภายนอก
  });
  
  wss.on('connection', (ws) => {
    console.log('Client connected');
  
    ws.on('message', (message) => {
      console.log('Received:', message);
      ws.send('Hello from WebSocket Server!');
    });
  
    ws.on('close', () => {
      console.log('Client disconnected');
    });
  });
  
  console.log('WebSocket server is running on ws://0.0.0.0:8001');

module.exports = wss;
