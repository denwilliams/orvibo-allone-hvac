const mqtt = require('./mqtt');
const { devices, on: onDeviceStatus } = require('./devices');
const { states, save } = require('./states');
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

onDeviceStatus('status', deviceStatus => {
  mqtt.emitStatus(deviceStatus.id, deviceStatus.state);
});

require('./gactions/server');

exports.devices = devices;

process.on('SIGINT', () => {
  save()
  .finally(() => process.exit());
});
