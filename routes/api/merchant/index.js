const express = require('express');
const db = require('../../../config/db');

const router = express.Router();

// Merchant
// CRUD
// Create a merchant
// Get all merchants
// Update a specific merchant
// Delete a merchant

router.post('/merchant', async (req, res) => {
  const { merchantEmail } = req.body;
  const { merchantPassword } = req.body;
  const { merchantRestaurantName } = req.body;
  const { merchantStreet } = req.body;
  const { merchantCity } = req.body;
  const { merchantState } = req.body;
  const { merchantZip } = req.body;
  const { merchantPhone } = req.body;

  try {
    await db.query(`INSERT INTO merchant (merchant_email, merchant_password, merchant_restaurant_name, merchant_street, merchant_city, merchant_state, merchant_zip, merchant_phone) VALUES ('${merchantEmail}', '${merchantPassword}', '${merchantRestaurantName}', '${merchantStreet}', '${merchantCity}', '${merchantState}', '${merchantZip}', '${merchantPhone}')`);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: 'There was a problem adding to AWS RDS database.' });
  }
  res.status(200).json({ message: 'Successfully added merchant to database!' });
});

module.exports = router;
