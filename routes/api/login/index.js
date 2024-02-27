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
  let merchant;
  const text = 'SELECT id, password FROM merchants WHERE email = $1';
  const values = [email];
  try {
    const databaseQuery = await db.query(text, values);
    [merchant] = databaseQuery.rows;
    databasePassword = merchant.password;
  } catch (error) {
    res.status(400).json({ message: error.message });
  }

  // Reference the initial session data
  const initialSessionData = req.session;

  // Validate that given password matches database password
  const match = await bcrypt.compare(password, databasePassword);
  if (match) {
    // Regenerate the session.
    req.session.regenerate((error) => {
      // Will have new session here
      if (error) throw Error(error.message);
      try {
        // Replace data from initial session to new session
        Object.assign(req.session, initialSessionData);

        // Set user property to the merchant id
        req.session.user = merchant.id;
      } catch (err) {
        console.log(err);
      }

      res.status(200).json({
        message: `Successfully logged in! Welcome back ${email}`,
        isLoggedIn: true,
      });
    });
  } else {
    res.status(400).json({ error: 'Invalid credentials, try again.' });
  }
});

module.exports = router;
