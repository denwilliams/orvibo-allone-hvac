const config = require('./config');
const mqtt = require('./mqtt');
const devices = require('./devices');
const logger = require('./logger');

mqtt.start();

mqtt.on('message', (data) => {
  const { deviceId, value, action } = data;

  const device = devices[deviceId];
  if (!device) {
    logger.warn('No device ' + deviceId);
    return;
  }

  if (action === 'mode') {
    device.mode(value);
    return;
  }

  if (action === 'temp') {
    device.temp(value);
    return;
  }
});


require('./gactions/server');

exports.devices = devices;
