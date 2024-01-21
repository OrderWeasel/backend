const express = require('express');

const router = express.Router();

// Goal: Obtain merchant "access token" and "refresh token"
// from using Square API and save to merchant record.

router.patch('/:id', async (req, res) => {
  const merchantId = req.params.id;
  res.status(200).json({ message: `PATCH method; connect Square where merchant_id = ${merchantId}` });

  // Square API?
  
});

module.exports = router;
