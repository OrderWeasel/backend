const express = require('express');
const validator = require('validator');
const bcrypt = require('bcrypt');
const { emailExists } = require('../merchants/handlers');
const db = require('../../../config/db');

const router = express.Router();

router.post('/', async (req, res) => {
  // Lowercase the email
  const email = req.body.email.toLowerCase();

  // All merchant information should be in the request body
  const {
    password,
    restaurantName,
    street,
    city,
    state,
    zip,
    phone,
  } = req.body;

  // Ensure that the email is a valid email
  if (!validator.isEmail(email)) {
    res.status(400).json({ error: 'Not a valid email, try again' });
    return;
  }

  // Ensure that the password is a strong password
  if (!validator.isStrongPassword(password)) {
    res.status(400).json({ error: 'Password must be 8 characters, with at least 1 uppercasse, 1 lowercase, 1 number, and 1 symbol' });
    return;
  }

  // Ensure that the email is not already being used
  if (await emailExists(email)) {
    res.status(400).json({ error: 'This email is already in use.' });
    return;
  }

  // Get the initial session data
  const initialSessionData = req.session;

  // Hash the password with a salt and save merchant to database
  const saltRounds = 10;
  bcrypt.hash(password, saltRounds, async (err, hash) => {
    try {
      const text = 'INSERT INTO merchants (email, password, restaurant_name, street, city, state, zip, phone) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id, email, restaurant_name, street, city, state, zip, phone';
      const values = [
        email,
        hash,
        restaurantName,
        street,
        city,
        state,
        zip,
        phone,
      ];
      const newMerchant = await db.query(text, values);

      // Regenerate the session
      req.session.regenerate((error) => {
        // Will have new session here
        if (error) throw Error(error.message);

        // Replace data from previous session to new session
        Object.assign(req.session, initialSessionData);

        // Set user proper to the merchant id
        req.session.user = newMerchant.rows[0].id;

        res.status(200).json(
          {
            message: 'Successfully added merchant to database!',
            isLoggedIn: true,
            newMerchantDetails: newMerchant.rows[0],
          },
        );
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  // Save new merchant to database
  // Log the user in
});

module.exports = router;
