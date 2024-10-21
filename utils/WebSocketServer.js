const WebSocket = require('ws');

const wss = new WebSocket.Server({
    port: 8001,
    host: '0.0.0.0'  // ฟังทุกอินเตอร์เฟส
});

module.exports = wss;
