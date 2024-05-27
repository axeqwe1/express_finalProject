const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8001 });

module.exports = wss;
