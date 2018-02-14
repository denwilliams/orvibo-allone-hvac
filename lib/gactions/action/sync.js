const config = require('../../config');
const devices = require('../../devices');

const UID = config.get('google_actions.uid')

/**
 *
 * @param data
 * {
 *   "uid": "213456",
 *   "auth": "bearer xxx",
 *   "requestId": "ff36a3cc-ec34-11e6-b1a0-64510650abcf"
 * }
 * @param response
 * @return {{}}
 * {
 *  "requestId": "ff36a3cc-ec34-11e6-b1a0-64510650abcf",
 *   "payload": {
 *     "devices": [{
 *         "id": "123",
 *         "type": "action.devices.types.Outlet",
 *         "traits": [
 *            "action.devices.traits.OnOff"
 *         ],
 *         "name": {
 *             "defaultNames": ["TP-Link Outlet C110"],
 *             "name": "Homer Simpson Light",
 *             "nicknames": ["wall plug"]
 *         },
 *         "willReportState: false,
 *         "attributes": {
 *         // None defined for these traits yet.
 *         },
 *         "roomHint": "living room",
 *         "config": {
 *           "manufacturer": "tplink",
 *           "model": "c110",
 *           "hwVersion": "3.2",
 *           "swVersion": "11.4"
 *         },
 *         "customData": {
 *           "fooValue": 74,
 *           "barValue": true,
 *           "bazValue": "sheepdip"
 *         }
 *       }, {
 *         "id": "456",
 *         "type": "action.devices.types.Light",
 *         "traits": [
 *           "action.devices.traits.OnOff",
 *           "action.devices.traits.Brightness",
 *           "action.devices.traits.ColorTemperature",
 *           "action.devices.traits.ColorSpectrum"
 *         ],
 *         "name": {
 *           "defaultNames": ["OSRAM bulb A19 color hyperglow"],
 *           "name": "lamp1",
 *           "nicknames": ["reading lamp"]
 *         },
 *         "willReportState: false,
 *         "attributes": {
 *           "TemperatureMinK": 2000,
 *           "TemperatureMaxK": 6500
 *         },
 *         "roomHint": "living room",
 *         "config": {
 *           "manufacturer": "osram",
 *           "model": "hg11",
 *           "hwVersion": "1.2",
 *           "swVersion": "5.4"
 *         },
 *         "customData": {
 *           "fooValue": 12,
 *           "barValue": false,
 *           "bazValue": "dancing alpaca"
 *         }
 *       }, {
 *         "id": "234"
 *         // ...
 *     }]
 *   }
 * }
 */
function sync(data) {
  // console.log('sync', data);

  // let devices = app.smartHomePropertiesSync(data.uid);
  // if (!devices) {
  //   response.status(500)
  //   .set({
  //     'Access-Control-Allow-Origin': '*',
  //     'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  //   })
  //   .json({error: 'failed'});
  //   return;
  // }

  // let deviceList = [];
  // Object.keys(devices).forEach(key => {
  //   if (devices.hasOwnProperty(key) && devices[key]) {
  //     let device = devices[key];
  //     device.id = key;
  //     deviceList.push(device);
  //   }
  // });

  return Promise.resolve()
  .then(() => {
    return devices.map(d => {
      return {
        id: `orvibo.${d.controller}.${d.id}`,
        type: 'action.devices.types.THERMOSTAT',
        traits: [
          'action.devices.traits.TemperatureSetting'
        ],
        name: {
          // defaultNames: ['Honeywell Thermostat T-1000'],
          name: d.name || `${d.id} hvac`,
          // nicknames: ['living room thermostat']
        },
        attributes: {
          availableThermostatModes: 'off,heat,cool,on',
          thermostatTemperatureUnit: 'C'
        },
        // deviceInfo: {
        //   manufacturer: "honeywell",
        //   model: "t-1000",
        //   hwVersion: "3.2",
        //   swVersion: "11.4"
        // },
        // "customData": {
        //   "fooValue": 74,
        //   "barValue": true,
        //   "bazValue": "lambtwirl"
        // },
        roomHint: d.room,
        willReportState: false
      };
    });
  })
  .then(devices => {
    return {
      requestId: data.requestId,
      payload: {
        agentUserId: UID,
        devices
      }
    };
  });
}

exports.sync = sync;
