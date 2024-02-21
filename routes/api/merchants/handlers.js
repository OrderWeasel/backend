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
  getMerchant,
  getAllMerchants,
  updateMerchant,
  deleteMerchant,
  emailExists,
};
