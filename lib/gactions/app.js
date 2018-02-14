const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const actionRouter = require('./action/router');
const authRouter = require('./auth/router');

app.use('/google-assistant/actions.devices', actionRouter);
app.use('/google-assistant/auth', authRouter);
app.use('/', (req, res) => {
  console.log('Unknown REQ', req);
  res.status(404).send();
});

module.exports = app;
