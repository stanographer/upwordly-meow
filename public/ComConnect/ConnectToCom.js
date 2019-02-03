const shareConnection = require('./shareDB');
const { serialPort } = require('./serialConnection');

// Starts the ShareDB connection and subscribes to the document.
module.exports = {
  start: function(settings) {
    const connection = shareConnection.connect('wss://upword.ly/ws');
    const doc = connection.get(settings.username, settings.job);

    doc.subscribe(err => {
      if (err) throw err;
      if (doc.type === null) console.error('This document could not be subscribed to.');
      console.log(`\nSuccessfully subscribed to [${settings.username}, ${settings.job}]!`);
    });

    doc.on('load', () => {
      serialPort(doc, settings.comPort);
    });
  }
};
