const express = require('express');
const db = require('../../../config/db');

const router = express.Router();

/*
Merchant
CRUD
Create a merchant NOTE: need to encypt password and tokens
Note: need to determine best practice for storing media files (merchant logo)
Get all merchants
Update a specific merchant
Delete a merchant
*/

// Create a new merchant
router.post('/', async (req, res) => {
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

// GET all merchants
router.get('/', async (req, res) => {
  let allMerchants;
  try {
    allMerchants = await db.query('SELECT * FROM merchant');
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: 'There was a problem adding to AWS RDS database.' });
  }
  res.status(200).json(allMerchants.rows);
});

// PATCH data on a merchant
router.patch('/:id', async (req, res) => {
  const { table } = req.body;
  const { columnName } = req.body;
  const { newValue } = req.body;
  const { id } = req.params;

  try {
    await db.query(`UPDATE ${table} SET ${columnName} = '${newValue}' WHERE merchant_id = ${id}`);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: 'There was a problem updating merchant on AWS RDS database.' });
  }
  res.status(200).json({ message: 'Sucessfully updatd merchant.' });
});

// Delete a merchant
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await db.query(`DELETE FROM merchant WHERE merchant_id = ${id}`);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: 'There was a problem deleting the merchant from AWS RDS database.'});
  }
  res.status(200).json({ message: 'Successfully deleted merchant.' });
});

module.exports = router;
