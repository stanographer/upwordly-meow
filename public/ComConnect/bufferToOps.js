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
        break;
      case 32:
        content.push(' ');
        break;
      case 13:
        content.push('\r');
        break;
      case 10:
        content.push('\n');
        break;
      default:
        content.push(String.fromCharCode(ops[i]));
        break;
    }
  }
  // Batch all the delete commands and send at the end.
  if (deletes > 0) {
    if (doc.data.length > deletes) {
      return [doc.data.length - deletes, {d: deletes}];
    }
    deletes = 0;

    // Batch all content and send at end.
  } else if (content.length > 0) {
    if (content.join('') === '\r\n\r\n\r\n') return [docEnd, '']; // Weird close-out sequence that Eclipse sends.
    if (content.join('') === '\r\n\r\n') return [docEnd, ''];
    return [docEnd, content.join('')];
  } else {
    return null;
  }
};

module.exports = bufferToOps;
