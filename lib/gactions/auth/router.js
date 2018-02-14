const router = require('express').Router();
const config = require('../../config');

const CLIENT_ID = config.get('google_actions.client_id');
const CLIENT_SECRET = config.get('google_actions.client_secret');
const DEMO_AUTH_CODE = config.get('google_actions.auth_code');
const DEFAULT_TOKEN = {
  token_type: 'bearer',
  access_token: config.get('google_actions.access_token'),
  refresh_token: config.get('google_actions.refresh_token')
};

router.get('/', (req, res) => res.send('OK'));


/**
 * expecting something like the following:
 *
 * GET https://myservice.example.com/auth? \
 *   client_id=GOOGLE_CLIENT_ID - The Google client ID you registered with Google.
 *   &redirect_uri=REDIRECT_URI - The URL to which to send the response to this request
 *   &state=STATE_STRING - A bookkeeping value that is passed back to Google unchanged in the result
 *   &response_type=code - The string code
 */
router.get('/oauth', (req, res) => {
  const  { client_id, redirect_uri, state, response_type, code } = req.query;

  if ('code' != response_type) {
    return res.status(400).send('response_type ' + response_type + ' must equal "code"');
  }

  if (!client_id === CLIENT_ID) {
    return res.status(400).send('client_id ' + client_id + ' invalid');
  }

  // if you have an authcode use that
  if (code) {
    return res.redirect(`${redirect_uri}?code=${code}&state=${state}`);
  }

  // let user = req.session.user;

  // Redirect anonymous users to login page.
  // if (!user) {
  //   return res.redirect(util.format('/login?client_id=%s&redirect_uri=%s&redirect=%s&state=%s',
  //     client_id, encodeURIComponent(redirect_uri), req.path, state));
  // }

  if (DEMO_AUTH_CODE) {
    return res.redirect(`${redirect_uri}?code=${DEMO_AUTH_CODE}&state=${state}`);
  }

  return res.status(400).send('something went wrong');
});

/**
 * client_id=GOOGLE_CLIENT_ID
 * &client_secret=GOOGLE_CLIENT_SECRET
 * &response_type=token
 * &grant_type=authorization_code
 * &code=AUTHORIZATION_CODE
 *
 * OR
 *
 *
 * client_id=GOOGLE_CLIENT_ID
 * &client_secret=GOOGLE_CLIENT_SECRET
 * &response_type=token
 * &grant_type=refresh_token
 * &refresh_token=REFRESH_TOKEN
 */
router.all('/token', function (req, res) {
  console.log('/token query', req.query);
  console.log('/token body', req.body);

  const client_id = req.query.client_id ? req.query.client_id : req.body.client_id;
  const client_secret = req.query.client_secret ? req.query.client_secret : req.body.client_secret;
  const grant_type = req.query.grant_type ? req.query.grant_type : req.body.grant_type;

  if (!client_id || !client_secret) {
    console.error('missing required parameter');
    return res.status(400).send('missing required parameter');
  }

  // if ('token' != req.query.response_type) {
  //     console.error('response_type ' + req.query.response_type + ' is not supported');
  //     return res.status(400).send('response_type ' + req.query.response_type + ' is not supported');
  // }

  const isValidClient = (client_id === CLIENT_ID) && (client_secret === CLIENT_SECRET);

  if (!isValidClient) {
    console.error('incorrect client data');
    return res.status(400).send('incorrect client data');
  }

  switch (grant_type) {
    case 'authorization_code':
      return handleAuthCode(req, res);
    case 'refresh_token':
      return handleRefreshToken(req, res);
    default:
      console.error('grant_type ' + grant_type + ' is not supported');
      return res.status(400).send('grant_type ' + grant_type + ' is not supported');
  }
});


/**
 * @return {{}}
 * {
 *   token_type: "bearer",
 *   access_token: "ACCESS_TOKEN",
 *   refresh_token: "REFRESH_TOKEN"
 * }
 */
function handleAuthCode(req, res) {
  console.log('handleAuthCode', req.query);
  // let client_id = req.query.client_id ? req.query.client_id : req.body.client_id;
  // let client_secret = req.query.client_secret ? req.query.client_secret : req.body.client_secret;
  let code = req.query.code ? req.query.code : req.body.code;

  if (!code) {
    console.error('missing required parameter');
    return res.status(400).send('missing required parameter');
  }

  if (code !== DEMO_AUTH_CODE) {
    console.error('invalid code');
    return res.status(400).send('invalid code');
  }
  // if (new Date(authCode.expiresAt) < Date.now()) {
  //   console.error('expired code');
  //   return res.status(400).send('expired code');
  // }
  // if (authCode.clientId != client_id) {
  //   console.error('invalid code - wrong client', authCode);
  //   return res.status(400).send('invalid code - wrong client');
  // }

  const token = DEFAULT_TOKEN;
  // let token = SmartHomeModel.getAccessToken(code);
  // if (!token) {
  //   console.error('unable to generate a token', token);
  //   return res.status(400).send('unable to generate a token');
  // }

  console.log('respond success', token);
  return res.status(200).json(token);
}

/**
 * @return {{}}
 * {
 *   token_type: "bearer",
 *   access_token: "ACCESS_TOKEN",
 * }
 */
function handleRefreshToken(req, res) {
  // let client_id = req.query.client_id ? req.query.client_id : req.body.client_id;
  // let client_secret = req.query.client_secret ? req.query.client_secret : req.body.client_secret;
  let refresh_token = req.refresh_token.code ? req.query.refresh_token : req.body.refresh_token;

  // let client = SmartHomeModel.getClient(client_id, client_secret);
  // if (!client) {
  //   console.error('invalid client id or secret %s, %s', client_id, client_secret);
  //   return res.error('invalid client id or secret');
  // }

  if (!refresh_token) {
    console.error('missing required parameter');
    return res.status(400).send('missing required parameter');
  }

  res.status(200).json({
    token_type: 'bearer',
    access_token: DEFAULT_TOKEN.access_token
  });
}

module.exports = router;
