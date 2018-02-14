const devices = require('../../devices');
const states = require('../../states');

function mapDevices() {
  const result = {};
  Object.keys(devices).forEach(id => {
    const state = states[id];
    result[id] = {
      toParams() {
        return {
          thermostatMode: mapMode(state),
          thermostatTemperatureSetpoint: state.temp
        };
      }
    };
  });
}

module.exports = mapDevices();


function mapMode(deviceState) {
  if (deviceState.power === false) return 'off';
  if (deviceState.mode === 'heat') return 'heat';
  if (deviceState.mode === 'cool') return 'cool';
  if (deviceState.mode === 'auto') return 'on';
}
