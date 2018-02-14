const devices = require('./devices');

/**
 * @param data:
 * {
 *   "requestId": "ff36a3cc-ec34-11e6-b1a0-64510650abcf",
 *   "uid": "213456",
 *   "auth": "bearer xxx",
 *   "commands": [{
 *     "devices": [{
 *       "id": "123",
 *       "customData": {
 *          "fooValue": 74,
 *          "barValue": false
 *       }
 *     }, {
 *       "id": "456",
 *       "customData": {
 *          "fooValue": 12,
 *          "barValue": true
 *       }
 *     }, {
 *       "id": "987",
 *       "customData": {
 *          "fooValue": 35,
 *          "barValue": false,
 *          "bazValue": "sheep dip"
 *       }
 *     }],
 *     "execution": [{
 *       "command": "action.devices.commands.OnOff",
 *       "params": {
 *           "on": true
 *       }
 *     }]
 *  }
 *
 * @param response
 * @return {{}}
 * {
 *   "requestId": "ff36a3cc-ec34-11e6-b1a0-64510650abcf",
 *   "payload": {
 *     "commands": [{
 *       "ids": ["123"],
 *       "status": "SUCCESS"
 *       "states": {
 *         "on": true,
 *         "online": true
 *       }
 *     }, {
 *       "ids": ["456"],
 *       "status": "SUCCESS"
 *       "states": {
 *         "on": true,
 *         "online": true
 *       }
 *     }, {
 *       "ids": ["987"],
 *       "status": "OFFLINE",
 *       "states": {
 *         "online": false
 *       }
 *     }]
 *   }
 * }
 */
function exec(data) {
  // console.log('exec', data);
  const uid = data.uid;

  const unrolled = data.commands.reduce((commandsArr, curCommand) => {
    const { devices, execution } = curCommand;

    return commandsArr.concat(devices.reduce((devicesArr, device) => {
      return devicesArr.concat(devicesArr.concat(execution.reduce((execArr, curExec) => {
        execArr.push({ device, execution: curExec });
        return execArr;
      }, [])));
    }, []));
  }, []);

  return Promise.all(unrolled.map(x => execDevice(x.execution, x.device)))
  .then(results => {
    return {
      requestId: data.requestId,
      payload: {
        commands: results
      }
    };
  });

  // return Promise.all(data.commands.map(curCommand => {
  //   const { devices, execution } = curCommand;

  //   return Promise.all(execution.map(curExec => {
  //     return execDevices(data.uid, curExec, devices);
  //   }))
  //   .then(() => {
  //     return {
  //       ids: devices.map(d => d.id),
  //       status: 'SUCCESS', // OFFLINE, FAILURE
  //       states: {}
  //     };
  //   });
  // }))
  // .then(commandResults => {
  //   return {
  //     requestId: data.requestId,
  //     payload: {
  //       commands: commandResults
  //     }
  //   };
  // });
}

/**
 *
 * @param uid
 * @param command
 * {
 *   "command": "action.devices.commands.OnOff",
 *   "params": {
 *       "on": true
 *   }
 * }
 * @param devices
 * [{
 *   "id": "123",
 *   "customData": {
 *      "fooValue": 74,
 *      "barValue": false
 *   }
 * }, {
 *   "id": "456",
 *   "customData": {
 *      "fooValue": 12,
 *      "barValue": true
 *   }
 * }, {
 *   "id": "987",
 *   "customData": {
 *      "fooValue": 35,
 *      "barValue": false,
 *      "bazValue": "sheep dip"
 *   }
 * }]
 * @return {Array}
 * [{
 *   "ids": ["123"],
 *   "status": "SUCCESS"
 *   "states": {
 *     "on": true,
 *     "online": true
 *   }
 * }, {
 *   "ids": ["456"],
 *   "status": "SUCCESS"
 *   "states": {
 *     "on": true,
 *     "online": true
 *   }
 * }, {
 *   "ids": ["987"],
 *   "status": "OFFLINE",
 *   "states": {
 *     "online": false
 *   }
 * }]
 */
// function execDevices(uid, command, devices) {
//   return Promise.all(devices.map(device => {
//     return execDevice(uid, command, device);
//   }))
//   .then(() => {
//   });
// }

/**
 *
 * @param uid
 * @param command
 * {
 *   "command": "action.devices.commands.OnOff",
 *   "params": {
 *       "on": true
 *   }
 * }
 * @param device
 * {
 *   "id": "123",
 *   "customData": {
 *      "fooValue": 74,
 *      "barValue": false
 *   }
 * }
 * @return {{}}
 * {
 *   "ids": ["123"],
 *   "status": "SUCCESS"
 *   "states": {
 *     "on": true,
 *     "online": true
 *   }
 * }
 */
function execDevice(command, device) {
  const id = device.id;
  const ids = id.split('.');
  const [orvibo, controller, deviceId] = ids;

  return execCommand[command.command](id, devices[deviceId], command.params);
}

const execCommand = {
  'action.devices.commands.ThermostatSetMode': (id, device, params) => {
    const { thermostatMode } = mode;
    return {
      ids: [id],
      status: 'SUCCESS', // OFFLINE, FAILURE
      states: device.toParams()
    };
  },
  'action.devices.commands.ThermostatTemperatureSetpoint': (id, device, params) => {
    const { thermostatTemperatureSetpoint } = params;
    return {
      ids: [id],
      status: 'SUCCESS', // OFFLINE, FAILURE
      states: device.toParams()
    };
  }
};

exports.exec = exec;
