const WebSocket = require('ws');
const wss = new WebSocket.Server({
    port: 80,
    perMessageDeflate: false,  // ปิดการบีบอัด
  });


module.exports = wss;
