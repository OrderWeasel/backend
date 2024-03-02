const CryptoJS = require('crypto-js');
const crypto = require('node:crypto');

function base64URLEncode(str) {
  return str.toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

function generateCodeVerifier() {
  return base64URLEncode(crypto.randomBytes(32));
}

function base64URL(string) {
  return string.toString(CryptoJS.enc.Base64).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

function generateCodeChallenge(codeVerifier) {
  const codeChallenge = base64URL(CryptoJS.SHA256(codeVerifier));
  return codeChallenge;
}

module.exports = {
  generateCodeVerifier,
  generateCodeChallenge,
};
