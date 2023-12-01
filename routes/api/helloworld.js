const express = require('express');

const router = express.Router();

router.get('/helloworld', (req, res) => {
  res.status(200).json({ message: 'hello world' });
});

module.exports = router;
