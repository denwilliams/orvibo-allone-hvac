const config = require('./config');
const devices = {};

config.get('devices').forEach(d => {
  devices[d.id] = initState();
});

module.exports = devices;

function initState() {
  return {
    mode: 'auto',
    temp: 20,
    power: false
  };
}
