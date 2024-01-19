// eslint-disable-next-line import/no-extraneous-dependencies
const format = require('pg-format');
const db = require('../../../config/db');

/*
Merchant
CRUD
Create a merchant NOTE: need to encypt password and tokens
Note: need to determine best practice for storing media files (merchant logo)
Get all merchants
Update a specific merchant
Delete a merchant
*/

const createMerchant = async (req, res) => {
  const values = [
    req.body.email,
    req.body.password,
    req.body.restaurantName,
    req.body.street,
    req.body.city,
    req.body.state,
    req.body.zip,
    req.body.phone,
  ];

  const text = 'INSERT INTO merchants (email, password, restaurant_name, street, city, state, zip, phone) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)';

  try {
    await db.query(text, values);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: 'There was a problem adding to AWS RDS database.' });
  }
  res.status(200).json({ message: 'Successfully added merchant to database!' });
};

const getMerchant = async (req, res) => {
  const { id } = req.params;
  const text = 'SELECT * FROM merchants WHERE id = $1';
  const values = [id];
  let merchant;
  try {
    merchant = await db.query(text, values);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: 'There was a problem fetching merchant data.' });
  }
  res.status(200).json(merchant.rows);
};

const getAllMerchants = async (req, res) => {
  let allMerchants;
  try {
    allMerchants = await db.query('SELECT * FROM merchants');
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: 'There was a problem fetching all merchants data.' });
  }
  res.status(200).json(allMerchants.rows);
};

const updateMerchant = async (req, res) => {
  const { id } = req.params;
  const { columnName, newValue } = req.body;
  const sql = format('UPDATE merchants SET %I = %L WHERE id = %s RETURNING *', columnName, newValue, id);
  let updatedMerchant;
  try {
    updatedMerchant = await db.query(sql);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: 'There was a problem updating merchant on AWS RDS database.' });
  }
  res.status(200).json({ message: 'Sucessfully updated merchant.', updatedMerchant: updatedMerchant.rows[0] });
};

const deleteMerchant = async (req, res) => {
  const { id } = req.params;
  const text = 'DELETE FROM merchants WHERE id = $1';
  const values = [id];
  try {
    await db.query(text, values);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: 'There was a problem deleting the merchant from AWS RDS database.' });
  }
  res.status(200).json({ message: 'Successfully deleted merchant.' });
};

module.exports = {
  createMerchant,
  getMerchant,
  getAllMerchants,
  updateMerchant,
  deleteMerchant,
};
