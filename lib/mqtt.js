const mqtt = require('mqtt');
const { EventEmitter } = require('events');

const config = require('./config');
const logger = require('./logger');

const emitter = new EventEmitter();

let mqttClient;
let mqttConnected = false;

const mqttUri = 'mqtt://' + config.get('mqtt.host');
const topicPrefix = config.get('mqtt.topic_prefix');

const subcribeTopics = [
  `${topicPrefix}/+/mode`,
  `${topicPrefix}/+/temp`
];

exports.start = () => {
  mqttClient  = mqtt.connect(mqttUri);

  mqttClient.on('message', (topic, message) => {
    console.log(topic, message.toString());
    const deviceTopic = topic.replace(topicPrefix + '/', '');

    const parts = deviceTopic.split('/');
    const [deviceId, action] = deviceTopic.split('/');

    const strMsg = message.toString();
    const data = strMsg ? JSON.parse(strMsg) : undefined;
    const { value } = data;

    emitter.emit('message', { deviceId, action, value });
  });

  mqttClient.on('connect', function () {
    logger.info('MQTT connected');
    mqttConnected = true;
    subcribeTopics.forEach(t => mqttClient.subscribe(t));
  });

  mqttClient.on('close', console.log);
  mqttClient.on('offline', console.log);
  // mqttClient.on('error', console.error);
};

exports.emitStatus = (deviceId, data) => {
  if (!mqttConnected) return;

  const topic = `${topicPrefix}/status/${deviceId}`;
  const json = JSON.stringify(data);

  mqttClient.publish(topic, json);
  logger.info(`Publish: ${topic} ${json}`);
};

exports.addListener = emitter.addListener.bind(emitter);
exports.on = emitter.on.bind(emitter);
exports.once = emitter.once.bind(emitter);
exports.removeListener = emitter.removeListener.bind(emitter);
