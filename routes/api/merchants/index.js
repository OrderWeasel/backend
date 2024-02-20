const express = require('express');

const router = express.Router();
const {
  createMerchant,
  getMerchant,
  getAllMerchants,
  updateMerchant,
  deleteMerchant,
} = require('./handlers');

// Create a new merchant
router.post('/', createMerchant);

// GET a merchant by id
router.get('/:id', getMerchant);

// GET all merchants
router.get('/', getAllMerchants);

// PATCH data on a merchant
router.patch('/:id', updateMerchant);

// Delete a merchant
router.delete('/:id', deleteMerchant);

module.exports = router;
