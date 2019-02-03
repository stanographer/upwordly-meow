const exec = require('child_process').execFile;

const configPorts = path => {
  console.log('path', path.toString());
  exec(`${path}\\public\\utils\\vspdconfig.exe`, (error, data) => {
    if (error) {
      console.error('error', error);
      throw error;
    }
    console.log('data', data.toString());
  });
};

module.exports = {
  configPorts
};
