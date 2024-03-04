/* eslint-disable func-names */

const CryptoJS = require('crypto-js');
const { randomBytes } = require('node:crypto');

const base64URLEncode = function (str) {
  return str.toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
};

const generateCodeVerifier = function () {
  return base64URLEncode(randomBytes(32));
};

const base64URL = function (string) {
  return string.toString(CryptoJS.enc.Base64).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
};

const generateCodeChallenge = function (codeVerifier) {
  const codeChallenge = base64URL(CryptoJS.SHA256(codeVerifier));
  return codeChallenge;
};

module.exports = {
  generateCodeVerifier,
  generateCodeChallenge,
};
