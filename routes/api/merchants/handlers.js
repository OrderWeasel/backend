// eslint-disable-next-line import/no-extraneous-dependencies
const format = require('pg-format');
const db = require('../../../config/db');

const emailExists = async (email) => {
  const text = 'SELECT * FROM merchants WHERE email = $1';
  const values = [email];
  let merchant;
  try {
    merchant = await db.query(text, values);
    if (merchant.rows.length > 0) {
      return true;
    }
  } catch (error) {
    console.log(error);
  }
  return false;
};

const idExists = async (id) => {
  const text = 'SELECT * FROM merchants WHERE id = $1';
  const values = [id];
  let merchant;
  try {
    merchant = await db.query(text, values);
  } catch (error) {
    console.log(error);
  }
  if (merchant.rows.length === 1) {
    return true;
  }
  return false;
};

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

  const text = 'INSERT INTO merchants (email, password, restaurant_name, street, city, state, zip, phone) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id, email, restaurant_name, street, city, state, zip, phone';
  let newMerchant;
  try {
    // Validate that the email is a valid email
    // ## CODE HERE ##

    // Validate that the password is strong enough
    // ## CODE HERE ##

    // Validate that the email does not already exist
    if (await emailExists(req.body.email)) {
      res.status(400).json({ message: 'This email is already being used' });
      return;
    }

    // Add a new row to the merchant table
    newMerchant = await db.query(text, values);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
    return;
  }
  res.status(200).json(
    {
      message: 'Successfully added merchant to database!',
      newMerchantDetails: newMerchant.rows[0],
    },
  );
};

const getMerchant = async (req, res) => {
  const { id } = req.params;
  const text = 'SELECT id, email, restaurant_name, street, city, state, zip, phone FROM merchants WHERE id = $1';
  const values = [id];
  let merchant;
  try {
    merchant = await db.query(text, values);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }

  if (merchant.rows.length < 1) {
    res.status(400).json({ error: 'There is no merchant with that id.' });
  } else {
    res.status(200).json(merchant.rows[0]);
  }
};

const getAllMerchants = async (req, res) => {
  let allMerchants;
  try {
    allMerchants = await db.query('SELECT id, email, restaurant_name, street, city, state, zip, phone FROM merchants');
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
  res.status(200).json(allMerchants.rows);
};

const updateMerchant = async (req, res) => {
  const { id } = req.params;
  const { columnName, newValue } = req.body;

  // Validate that id exists
  const validId = await idExists(id);
  if (!validId) {
    res.status(400).json({ error: 'Merchant does not exist.' });
    return;
  }

  // Respond with error if trying to change id
  if (columnName === 'id') {
    res.status(400).json({ error: 'Cannot change id' });
    return;
  }

  // Respond with "incorrect route" if trying to update password
  if (columnName === 'password') {
    res.status(400).json({ error: 'Incorrect route for updating password' });
    return;
  }

  const sql = format('UPDATE merchants SET %I = %L WHERE id = %s RETURNING email, restaurant_name, street, city, state, zip, phone', columnName, newValue, id);
  let updatedMerchant;
  try {
    updatedMerchant = await db.query(sql);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
    return;
  }
  res.status(200).json({ message: 'Sucessfully updated merchant.', updatedMerchant: updatedMerchant.rows[0] });
};

const deleteMerchant = async (req, res) => {
  const { id } = req.params;
  const text = 'DELETE FROM merchants WHERE id = $1';
  const values = [id];
  try {
    const validId = await idExists(id);
    if (validId) {
      await db.query(text, values);
    } else {
      throw Error('Merchant does not exist.');
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
    return;
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
