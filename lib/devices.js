const controllers = require('./controllers');
const logger = require('./logger');
const profiles = require('./profiles');
const states = require('./states');
const config = require('./config');

const devices = {};

config.get('devices').forEach(d => {
  devices[d.id] = initDevice(d);
});

module.exports = devices;

function initDevice(device) {
  const profile = profiles[device.profile];
  const controller = controllers[device.controller];
  const state = states[device.id];

  function turnOn() {
    return new Promise(resolve => {
      controller.emitIR(profile['on']);
      state.power = true;
      logger.info(`Turning on ${device.id}`);
      setTimeout(resolve, 1000);
    });
  }

  function turnOff() {
    return new Promise(resolve => {
      controller.emitIR(profile['off']);
      state.power = false;
      logger.info(`Turning off ${device.id}`);
      setTimeout(resolve, 1000);
    });
  }

  function setState(mode, temp) {
    return new Promise(resolve => {
      const code = profile[mode][temp];
      controller.emitIR(code);
      state.mode = mode;
      state.temp = temp;
      logger.info(`Setting state on ${device.id} to ${mode}:${temp}`);
      setTimeout(resolve, 1000);
    });
  }

  return {
    mode(mode) {
      if (mode === 'off') {
        return turnOff();
      }

      if (mode === 'on') {
        return turnOn()
        .then(() => setState(state.mode, state.temp));
      }

      return Promise.resolve(state.power)
      .then(isOn => {
        if (isOn) return;
        return turnOn();
      })
      .then(() => setState(mode, state.temp));
    },
    temp(temp) {
      return Promise.resolve(state.power)
      .then(isOn => {
        if (isOn) return;
        return turnOn();
      })
      .then(() => setState(state.mode, temp));
    }
  }
}
