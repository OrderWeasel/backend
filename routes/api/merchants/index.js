const express = require('express');

const router = express.Router();
const {
  getMerchant,
  getAllMerchants,
  updateMerchant,
  deleteMerchant,
} = require('./handlers');

// Initialize session
const initializeSession = (req, res, next) => {
  if (!req.session.init) {
    req.session.init = true;
  }
  return next();
};

// Authenticated merchant may PATCH and DELETE only their own data
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

// GET a merchant by id
router.get('/:id', initializeSession, getMerchant);

// GET all merchants
router.get('/', initializeSession, getAllMerchants);

// PATCH data on a merchant
router.patch('/:id', verifyAuth, updateMerchant);

// Delete a merchant
router.delete('/:id', verifyAuth, deleteMerchant);

module.exports = router;
