const express = require('express');

const router = express.Router();

// Goal: Obtain merchant "access token" and "refresh token"
// from using Square API and save to merchant record.

const CryptoJS = require("crypto-js");
const crypto = require('node:crypto');
const format = require('pg-format');
const db = require('../../../config/db');

function base64URLEncode(str) {
  return str.toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

function generateCodeVerifier() {
  return base64URLEncode(crypto.randomBytes(32));
}

function generateCodeChallenge(codeVerifier) {
  const codeChallenge = base64URL(CryptoJS.SHA256(codeVerifier));
  return codeChallenge;
}

function base64URL(string) {
  return string.toString(CryptoJS.enc.Base64).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')
}

router.get('/geturl/:id', async (req, res) => {
  const { id } = req.params;
  const columnName = 'code_verifier';
  const codeVerifier = generateCodeVerifier();
  const codeChallenge = generateCodeChallenge(codeVerifier);
  const url = `https://connect.squareupsandbox.com/oauth2/authorize?scope=ITEMS_READ%20ORDERS_WRITE%20ORDERS_READ%20PAYMENTS_WRITE&client_id=${process.env.SQ_SANDBOX_APP_ID}&code_challenge=${codeChallenge}`;
  const sql = format('UPDATE merchants SET %I = %L WHERE id = %s RETURNING *', columnName, codeVerifier, id);
  let updatedMerchant;
  try {
    updatedMerchant = await db.query(sql);
  } catch (error) {
    console.log(error);
  }
  console.log(updatedMerchant.rows[0]);
  res.status(200).json({ codeVerifier, codeChallenge, url });
});

// Process the authorization token
router.get('/oauth-redirect', async (req, res) => {
  
});

router.patch('/:id', async (req, res) => {
  const merchantId = req.params.id;
  res.status(200).json({ message: `PATCH method; connect Square where merchant_id = ${merchantId}` });

  // Square API?
  // Send URL

  
});

module.exports = router;
