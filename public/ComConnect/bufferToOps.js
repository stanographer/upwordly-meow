const bufferToOps = (ops, doc) => {
  /*
   Takes an array of buffer array and translates
   them to ShareDB ones:
   32 = space
   8 = backspace
   13 = carriage return
   10 = linefeed
   */

  let deletes = 0;
  let content = [];
  let docEnd = doc.data.length;

  for (let i = 0; i < ops.length; i++) {
    switch (ops[i]) {
      case 8:
        deletes += 1;
        console.log('backspace');
        break;
      case 32:
        content.push(' ');
        console.log('space');
        break;
      case 13:
        content.push('\r');
        console.log('carriage return');
        break;
      case 10:
        content.push('\n');
        console.log('line feed');
        break;
      default:
        content.push(String.fromCharCode(ops[i]));
        break;
    }
  }
  // Batch all the delete commands and send at the end.
  if (deletes > 0) {
    if (doc.data.length > deletes) {
      console.log([doc.data.length - deletes, {d: deletes}]);
      return [doc.data.length - deletes, {d: deletes}];
    }
    deletes = 0;
    // Batch all content and send at end.
  } else if (content.length > 0) {
    if (content.join('') === '\r\n\r\n\r\n') return null;
    if (content.join('') === '\r\n\r\n') return null;
    console.log([docEnd, content.join('')]);
    return [docEnd, content.join('')];
  } else {
    return null;
  }
};

module.exports = bufferToOps;
