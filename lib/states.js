const { join } = require('path');
const { existsSync, writeFile } = require('fs');

const config = require('./config');
const devices = {};
const savedStatePath = join(config.get('data_path'), 'states.json');

const prevState = (existsSync(savedStatePath))
  ? require(savedStatePath)
  : {};

config.get('devices').forEach(d => {
  devices[d.id] = prevState[d.id] || initState();
});

exports.states = devices;
exports.save = () => {
  return new Promise((resolve, reject) => {
    writeFile(savedStatePath, JSON.stringify(devices), 'utf8', (err) => {
      if (err) {
        console.error('Unable to save state', err);
        return reject(err);
      }
      console.info('Saved');
      resolve();
    });
  });
};

function initState() {
  return {
    mode: 'auto',
    temp: 20,
    power: false
  };
}
