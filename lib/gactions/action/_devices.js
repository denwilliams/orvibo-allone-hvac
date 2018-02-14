// https://developers.google.com/actions/smarthome/light-schema#sync_sample

exports.DEVICE_LIST = [{
  id: 'njksdkjskn92ine',
  type: 'action.devices.types.LIGHT',
  traits: [
    'action.devices.traits.OnOff'
  ],
  name: {
    name: 'lamp1'
  },
  willReportState: true
}];

exports.DEVICE_LIST_2 = [{
  id: '123',
  type: 'action.devices.types.LIGHT',
  traits: [
    'action.devices.traits.OnOff',
    'action.devices.traits.Brightness',
    'action.devices.traits.ColorTemperature',
    'action.devices.traits.ColorSpectrum'
  ],
  name: {
    defaultNames: [
      'OSRAM bulb A19 color hyperglow'
    ],
    name: 'lamp1',
    nicknames: [
      'reading lamp'
    ]
  },
  willReportState: true,
  'attributes': {
    'TemperatureMinK': 2000,
    'TemperatureMaxK': 6500
  },
  roomHint: 'living room',
  config: {
    manufacturer: 'osram',
    model: 'hg11',
    hwVersion: '1.2',
    swVersion: '5.4'
  },
  customData: {
    fooValue: 12,
    barValue: false,
    bazValue: 'dancing alpaca'
  }
}];
