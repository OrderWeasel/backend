const express = require('express');
const bcrypt = require('bcrypt');
const { emailExists } = require('../merchants/handlers');
const db = require('../../../config/db');

const router = express.Router();

router.post('/', async (req, res) => {
  const email = req.body.email.toLowerCase();
  const { password } = req.body;

  // Validate email exists
  const validEmail = await emailExists(email);
  if (!validEmail) {
    res.status(400).json({ error: 'Invalid email. Please try again' });
    return;
  }

  // Get the hashed pw on the database
  let databasePassword;
  const text = 'SELECT password FROM merchants WHERE email = $1';
  const values = [email];
  try {
    const databaseQuery = await db.query(text, values);
    databasePassword = databaseQuery.rows[0].password;
  } catch (error) {
    res.status(400).json({ message: error.message });
  }

  // Validate that given password matches database password
  const match = await bcrypt.compare(password, databasePassword);
  if (match) {
    res.status(200).json({ message: `Successfully logged in! Welcome back ${email}` });
  } else {
    res.status(400).json({ error: 'Invalid credentials, try again.' });
  }
});

module.exports = router;
