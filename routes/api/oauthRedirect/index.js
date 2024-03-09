/* eslint-disable camelcase */
const express = require('express');

const router = express.Router();

const { createClient } = require('redis');
const db = require('../../../config/db');
const { saveTokens } = require('./helpers');

const urlToParamObject = (url) => {
  const paramObject = {};
  const paramString = url.split('?')[1];
  const paramArray = paramString.split('&');
  for (let i = 0; i < paramArray.length; i += 1) {
    const key = paramArray[i].split('=')[0];
    const value = paramArray[i].split('=')[1];
    paramObject[key] = value;
  }
  return paramObject;
};

const obtainTokens = async (client_id, grant_type, redirect_uri, code, code_verifier) => {
  try {
    const response = await fetch('https://connect.squareupsandbox.com/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Square-Version': '2022-04-20',
      },
      body: JSON.stringify({
        client_id, grant_type, redirect_uri, code, code_verifier,
      }),
    });

    const result = await response.json();
    if (response.ok) {
      return result;
    }
    throw Error(result.message);
  } catch (error) {
    return error;
  }
};

// Receive the code and obtain Access and Refresh tokens
router.get('/', async (req, res) => {
  const paramObject = urlToParamObject(req.url);

  // eslint-disable-next-line camelcase
  const {
    state, code, error, error_description,
  } = paramObject;

  console.log(code);
  console.log(error);
  console.log(error_description);

  if (error) {
    res.status(200).json({ error: error_description });
    return;
  }

  const decodedState = decodeURIComponent(state.split('session')[0]);
  console.log(`And the state is ${decodedState}`);

  // Create redis client:
  const redisClient = createClient();

  // Connect to redis client:
  redisClient.connect();

  // Check if the state query param provided matches one in Redis store
  const previousSessionId = await redisClient.get(decodedState);
  console.log('PREV SESS ID IS:');
  console.log(previousSessionId);
  if (!previousSessionId) {
    res.status(400).json({ error: 'Query param, state, does not match' });
    return;
  }

  // Get the previous session data
  let oldSession = await redisClient.get(`myapp:${previousSessionId}`);
  oldSession = JSON.parse(oldSession);
  console.log('old state:');
  console.log(oldSession);

  // Destroy previous session
  await redisClient.del(`myapp:${previousSessionId}`);

  // Disconnect from redis client
  await redisClient.disconnect();

  // Regenerate session using the saved sessionId
  req.session.regenerate(async (e) => {
    // Will have a new session here:
    // Check if any regeneration error:
    if (e) {
      console.log(e);
      return;
    }

    // Replace data from initial session to new session
    Object.assign(req.session, oldSession);

    console.log('the new session is:');
    console.log(req.session);
    console.log(req.session.user);

    // Start Obtain token flow
    let codeVerifier;
    let tokens;
    try {
      const redirectUri = 'http://localhost:3000/api/oauth-redirect';
      const grantType = 'authorization_code';
      const result = await db.query(`SELECT code_verifier FROM merchants WHERE id = ${req.session.user}`);
      codeVerifier = result.rows[0].code_verifier;
      console.log('The code verifier is:');
      console.log(codeVerifier);
      tokens = await obtainTokens(
        process.env.SQ_SANDBOX_APP_ID,
        grantType,
        redirectUri,
        code,
        codeVerifier,
      );
      console.log(tokens);

      // Save tokens
      saveTokens(tokens, req.session.user);
    } catch (err) {
      console.log(err);
    }
    res.status(200).json({ message: 'You have successfully integrated your Square account!' });
  });
});

module.exports = router;
