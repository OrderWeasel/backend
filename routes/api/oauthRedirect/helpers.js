/* eslint-disable func-names */
const {
  randomBytes,
  createCipheriv,
  createDecipheriv,
} = require('node:crypto');
const db = require('../../../config/db');

const encryptToken = function (token) {
  const algorithm = 'aes-256-cbc';
  const iv = randomBytes(16).toString('hex').substring(0, 16);

  const cipher = createCipheriv(algorithm, process.env.ENCRYPT_KEY, iv);
  let encrypted = cipher.update(token, 'utf8', 'hex');

  encrypted += cipher.final('hex');

  return {
    iv,
    encrypted,
  };
};

const decryptToken = function (token, iv) {
  const algorithm = 'aes-256-cbc';
  const decipher = createDecipheriv(algorithm, process.env.ENCRYPT_KEY, iv);

  let decrypted = decipher.update(token, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
};

const pushToDatabase = async function (encryptedAccessToken, encryptedRefreshToken, id) {
  const access = encryptedAccessToken.iv + encryptedAccessToken.encrypted;
  const refresh = encryptedRefreshToken.iv + encryptedRefreshToken.encrypted;
  const text = `UPDATE merchants SET sq_access_token='${access}', sq_refresh_token='${refresh}' WHERE id = ${id}`;
  try {
    await db.query(text);
    console.log('saved tokens!!!!!');
  } catch (error) {
    console.log(error);
  }
};

const saveTokens = function (tokens, id) {
  try {
    const encryptedAccess = encryptToken(tokens.access_token);
    const encrytpedRefresh = encryptToken(tokens.refresh_token);
    pushToDatabase(encryptedAccess, encrytpedRefresh, id);
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  encryptToken,
  decryptToken,
  pushToDatabase,
  saveTokens,
};
