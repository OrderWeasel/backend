/* eslint-disable camelcase */
const express = require('express');
const db = require('../../../config/db');

const router = express.Router();

// Verify authenticated user
const verifyAuth = (req, res, next) => {
  // Validate that the merchant is authenticated:
  console.log(`Session Checker: ${req.session.id}`);
  console.log(req.session);
  if (req.session.user) {
    console.log('Found User Session');
  } else {
    console.log('No User Session Found');
    res.status(400).json({ message: 'Please login or sign up to continue.' });
    return;
  }

  // Validate that the merchant is requesting to only change own data:
  if (Number(req.session.user) === Number(req.params.id)) {
    next();
  } else {
    res.status(401).json({ error: 'Unauthorized request.' });
  }
};

const authorizationCompleted = async (id) => {
  const text = 'SELECT sq_access_token FROM merchants WHERE id = $1';
  const values = [id];

  try {
    const result = await db.query(text, values);
    const { sq_access_token } = result.rows[0];
    console.log(result.rows[0].sq_access_token);
    if (sq_access_token && sq_access_token.length > 0) {
      return true;
    }
    return false;
  } catch (error) {
    console.log(error);
    return false;
  }
};

router.post('/:id', verifyAuth, async (req, res) => {
  const { id } = req.params;

  // Check if authorization is completed
  const oAuthCompleted = await authorizationCompleted(id);
  if (!oAuthCompleted) {
    res.status(400).json({ error: 'There is no Square integreation available to disconnect.' });
    return;
  }

  // Update the database
  try {
    const text = 'UPDATE merchants SET code_verifier=null, sq_access_token=null, sq_refresh_token=null WHERE id = $1 RETURNING *';
    const values = [id];
    const updatedMerchant = await db.query(text, values);
    console.log(updatedMerchant.rows[0]);
    res.status(200).json({ message: 'Successfully disconnected Square integration. You must also log in to your Square account and remove OrderWeasel from your approved integrations.' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
