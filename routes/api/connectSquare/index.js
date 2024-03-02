const express = require('express');
const crypto = require('node:crypto');
const format = require('pg-format');
const { createClient } = require('redis');
const db = require('../../../config/db');
const { generateCodeVerifier, generateCodeChallenge } = require('./helpers');

const router = express.Router();

router.get('/geturl/:id', async (req, res) => {
  const { id } = req.params;

  // Connect to Redis client
  const redisClient = createClient();
  redisClient.connect();

  // Check if merchant has already provided authorization,
  // if so, send appropriate response. Else:

  // Generate nonce
  const nonce = crypto.randomBytes(16).toString('base64');

  console.log(`The nonce is ${nonce}`);
  console.log(`The session id is ${String(req.session.id)}`);
  console.log('-----------------------------------------');
  console.log('-----------------------------------------');

  // Save to redisClient key=nonce value=req.session.id
  await redisClient.set(nonce, String(req.session.id));

  // Disconnect from redisClient
  await redisClient.disconnect();

  // Generate code_verifier and code_challenge url params
  const columnName = 'code_verifier';
  const codeVerifier = generateCodeVerifier();
  const codeChallenge = generateCodeChallenge(codeVerifier);

  // Include nonce in the url query params
  const url = `https://connect.squareupsandbox.com/oauth2/authorize?state=${nonce}session=false&scope=ITEMS_READ&client_id=${process.env.SQ_SANDBOX_APP_ID}&code_challenge=${codeChallenge}`;
  const sql = format('UPDATE merchants SET %I = %L WHERE id = %s RETURNING *', columnName, codeVerifier, id);

  // Save code_verifier to database
  try {
    await db.query(sql);
  } catch (error) {
    console.log(error);
  }

  // Respond with Square authroization URL
  res.status(200).json({ codeVerifier, codeChallenge, url });
});

module.exports = router;
