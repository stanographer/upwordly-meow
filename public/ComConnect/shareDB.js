const ShareDB = require('@teamwork/sharedb/lib/client');
const ReconnectingWebSocket = require('reconnecting-websocket');
const otText = require('ot-text');
const ws = require('ws');

module.exports = {
  connect: function() {
    const socket = new ReconnectingWebSocket('wss://upword.ly/ws', [], {
      WebSocket: ws,
      automaticOpen: true,
      maxReconnectionDelay: 2000,
      reconnectInterval: 2000,
      maxReconnectInterval: 3000,
      timeoutInterval: 2000,
      maxRetries: Infinity
    });

    const connection = new ShareDB.Connection(socket);
    ShareDB.types.register(otText.type);
    return connection;
  }
};
