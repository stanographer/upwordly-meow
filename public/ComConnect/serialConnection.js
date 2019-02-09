const SerialConnection = require('serialport');
const bufferToOps = require('./bufferToOps');

module.exports = {
  serialPort: function(doc, COM_PORT) {
    const port = new SerialConnection(`\\\\.\\COM${ COM_PORT }`, {
      autoOpen: false,
      baudRate: 9600,
      parity: 'even',
      dataBits: 8,
      bufferSize: 10,
      stopBits: 1
    });

    port.open(function(err) {
      if (err) return console.log('Error opening port: ', err.message);
    });

    // The open event is always emitted
    port.on('open', function() {
      console.log('Port connected at: ' + COM_PORT + '\n\n' + 'You may begin writing now.');
    });

    port.on('close', function() {
      console.log('Port connected at: ' + COM_PORT + '\n\n' + 'You may begin writing now.');
    });

    // When the port receives data, process it, and send it.
    port.on('data', data => {
      const op = data.toJSON();
      if (op.type !== 'Buffer') return new Error('Cannot read this type of stream.');
      setTimeout(() => doc.submitOp(bufferToOps(op.data, doc)), 0);
    });
  }
};
