const express = require('express');
const db = require('../../config/db');

const router = express.Router();

router.post('/merchant', async (req, res) => {
  console.log(req.body);
  const { merchantEmail } = req.body;
  const { merchantRestaurantName } = req.body;
  console.log(merchantEmail);
  console.log(merchantRestaurantName);
  try {
    await db.query(`INSERT INTO merchant (merchant_email, merchant_restaurant_name) VALUES ('${merchantEmail}', '${merchantRestaurantName}')`);
  } catch (error) {
    console.log(error);
    res.json({ error: 'There was a problem adding to AWS RDS database.' });
  }
  res.status(200).json({ message: 'Successfully added merchant to database!' });
});

module.exports = router;
