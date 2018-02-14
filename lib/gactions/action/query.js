const config = require('../../config');
const devices = require('./devices');

/**
 *
 * @param data
 * {
 *   "requestId": "ff36a3cc-ec34-11e6-b1a0-64510650abcf",
 *   "uid": "213456",
 *   "auth": "bearer xxx",
 *   "devices": [{
 *     "id": "123",
 *       "customData": {
 *         "fooValue": 12,
 *         "barValue": true,
 *         "bazValue": "alpaca sauce"
 *       }
 *   }, {
 *     "id": "234"
 *   }]
 * }
 * @param response
 * @return {{}}
 * {
 *  "requestId": "ff36a3cc-ec34-11e6-b1a0-64510650abcf",
 *   "payload": {
 *     "devices": {
 *       "123": {
 *         "on": true ,
 *         "online": true
 *       },
 *       "456": {
 *         "on": true,
 *         "online": true,
 *         "brightness": 80,
 *         "color": {
 *           "name": "cerulian",
 *           "spectrumRGB": 31655
 *         }
 *       },
 *       ...
 *     }
 *   }
 * }
 */
function query(data) {
  // console.log('query', data);

  return Promise.all(data.devices.map(d => {
    const id = d.id;

    const ids = id.split('.');
    const [orvibo, controller, deviceId] = ids;

    return getDeviceParams(controller, deviceId)
    .then(params => ({ id, params }));
  }))
  .then(results => {
    return results.reduce((obj, result) => {
      obj[result.id] = result.params;
      return obj;
    }, {});
  })
  .then(devices => {
    return {
      requestId: data.requestId,
      payload: { devices }
    };
  });
}

function getDeviceParams(controller, deviceId) {
  const device = devices[deviceId];
  return Object.assign({ online: true}, device.toParams());
}

/**
 *
 * @param devices
 * [{
 *   "id": "123"
 * }, {
 *   "id": "234"
 * }]
 * @return {Array} ["123", "234"]
 */
function getDeviceIds(devices) {
  return devices.map(d => d.id).filter(Boolean);
}

exports.query = query;
