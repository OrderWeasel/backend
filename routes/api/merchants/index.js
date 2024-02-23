const express = require('express');

const router = express.Router();
const {
  getMerchant,
  getAllMerchants,
  updateMerchant,
  deleteMerchant,
} = require('./handlers');

// Authenticated merchant may PATCH and DELETE only their own data
const verifyAuth = (req, res, next) => {
  if (Number(req.session.user) === Number(req.params.id)) {
    next();
  } else {
    res.status(401).json({ error: 'Unauthorized request.' });
  }
};

// GET a merchant by id
router.get('/:id', getMerchant);

// GET all merchants
router.get('/', getAllMerchants);

// PATCH data on a merchant
router.patch('/:id', verifyAuth, updateMerchant);

// Delete a merchant
router.delete('/:id', verifyAuth, deleteMerchant);

module.exports = router;
