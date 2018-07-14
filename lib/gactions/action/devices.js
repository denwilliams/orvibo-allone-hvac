const { devices } = require('../../devices');
const states = require('../../states');

function mapDevices() {
  const result = {};
  Object.keys(devices).forEach(id => {
    const state = states[id];
    const device = devices[id];
    result[id] = {
      toParams() {
        return {
          thermostatMode: mapMode(state),
          thermostatTemperatureSetpoint: state.temp
        };
      },
      mode: device.mode.bind(device),
      temp: device.temp.bind(device)
    };
  });
  return result;
}

module.exports = mapDevices();


function mapMode(deviceState) {
  if (deviceState.power === false) return 'off';
  if (deviceState.mode === 'heat') return 'heat';
  if (deviceState.mode === 'cool') return 'cool';
  if (deviceState.mode === 'auto') return 'on';
}
