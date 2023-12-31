const express = require('express');

const router = express.Router();

router.get('/helloworld', (req, res) => {
  // Test process.env variables
  console.log(`username is ${process.env.DB_USER}`);

  // Test JSON response
  res.status(200).json({ message: 'hello world' });
});

module.exports = router;
