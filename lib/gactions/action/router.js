const util = require('util');

const intents = require('./intents');

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization'
};

const router = require('express').Router();

/**
 *
 * action: {
 *   initialTrigger: {
 *     intent: [
 *       "action.devices.SYNC",
 *       "action.devices.QUERY",
 *       "action.devices.EXECUTE"
 *     ]
 *   },
 *   httpExecution: "https://example.org/device/agent",
 *   accountLinking: {
 *     authenticationUrl: "https://example.org/device/auth"
 *   }
 * }
 */
router.post('/', (req, res) => {
  console.log('<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<');
  // console.log('post /google-assistant/actions.devices');
  // console.log(JSON.stringify(req.headers));
  console.log(util.inspect(req.body, { depth: null, colors: true }));
  console.log('-----------------------------------');

  // console.log('----------');

  const { inputs, requestId } = req.body;

  // let authToken = authProvider.getAccessToken(request);
  // let uid = datastore.Auth.tokens[authToken].uid;

  if (!inputs) {
    return missingInputs(res);
  }

  Promise.all(inputs.map(input => {
    const { intent } = input;

    if (!intent) {
      return missingInputs(res);
    }

    // console.log('INTENT', intent);
    if (intents[intent]) {
      return intents[intent](input, res, requestId);
    }

    return missingInputs(res);
  }))
  .then((results) => {
    const [result] = results;
    // console.log('--- RESULTS ----');
    console.log(util.inspect(result, { depth: null, colors: true }));
    // console.log('--- ======= ----');
    res.status(200).json(result);
    console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
  })
  .catch(err => {
    console.log('ERR', err);
    res.status(400).json({ message: err.message });
  });
});

/**
 * Enables prelight (OPTIONS) requests made cross-domain.
 */
router.options('/', (req, res) => {
  res.status(200)
  .set(CORS_HEADERS)
  .send('null');
});

function missingInputs(res) {
  return res.status(401)
  .set({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  })
  .json({error: 'missing inputs'});
}

module.exports = router;
