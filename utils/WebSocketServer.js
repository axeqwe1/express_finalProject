const WebSocket = require('ws');

const wss = new WebSocket.Server({
    port: 8001,
    host: '0.0.0.0'  // ฟังทุกอินเตอร์เฟส
});

wss.on('connection', (ws) => {
    console.log('Client connected');
    ws.on('message', (message) => {
        console.log('Received:', message);
        ws.send('Hello from server!');
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

module.exports = wss;
