const { sync } = require('./sync');
const { query } = require('./query');
const { exec } = require('./exec');

exports['action.devices.SYNC'] = (input, response, requestId) => {
  /**
   * request:
   * {
   *  "requestId": "ff36a3cc-ec34-11e6-b1a0-64510650abcf",
   *  "inputs": [{
   *      "intent": "action.devices.SYNC",
   *  }]
   * }
   */
  return sync({
    // uid: uid,
    // auth: authToken,
    requestId: requestId
  });
};

exports['action.devices.QUERY'] = (input, response, requestId) => {
  /**
   * request:
   * {
   *   "requestId": "ff36a3cc-ec34-11e6-b1a0-64510650abcf",
   *   "inputs": [{
   *       "intent": "action.devices.QUERY",
   *       "payload": {
   *          "devices": [{
   *            "id": "123",
   *            "customData": {
   *              "fooValue": 12,
   *              "barValue": true,
   *              "bazValue": "alpaca sauce"
   *            }
   *          }, {
   *            "id": "234",
   *            "customData": {
   *              "fooValue": 74,
   *              "barValue": false,
   *              "bazValue": "sheep dip"
   *            }
   *          }]
   *       }
   *   }]
   * }
   */
  return query({
    // uid: uid,
    // auth: authToken,
    requestId,
    devices: input.payload.devices
  });
};

exports['action.devices.EXECUTE'] = (input, response, requestId) => {
  /**
   * request:
   * {
   *   "requestId": "ff36a3cc-ec34-11e6-b1a0-64510650abcf",
   *   "inputs": [{
   *     "intent": "action.devices.EXECUTE",
   *     "payload": {
   *       "commands": [{
   *         "devices": [{
   *           "id": "123",
   *           "customData": {
   *             "fooValue": 12,
   *             "barValue": true,
   *             "bazValue": "alpaca sauce"
   *           }
   *         }, {
   *           "id": "234",
   *           "customData": {
   *              "fooValue": 74,
   *              "barValue": false,
   *              "bazValue": "sheep dip"
   *           }
   *         }],
   *         "execution": [{
   *           "command": "action.devices.commands.OnOff",
   *           "params": {
   *             "on": true
   *           }
   *         }]
   *       }]
   *     }
   *   }]
   * }
   */
  return exec({
    // uid: uid,
    // auth: authToken,
    requestId,
    commands: input.payload.commands
  });
};
