const WebSocket = require('ws');
const wss = new WebSocket.Server({
    port: 80
  });


module.exports = wss;
