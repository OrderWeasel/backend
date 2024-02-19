const express = require('express');

const fs = require('fs');
const path = require('path');
const db = require('../../../config/db');

const sqlFilePath = path.resolve('database/database.sql');
const router = express.Router();

// for development only
router.post('/', async (req, res) => {
  try {
    const sqlFile = fs.readFileSync(sqlFilePath, 'utf8');
    const commands = sqlFile.split(';');

    for (let i = 0; i < commands.length; i++) {
      let command = commands[i];
      await db.query(command);
    }
    
    res.status(200).json({ success: 'Database reset successfully...' });
  } catch (e) {
    console.log(e);
    res.status(400).json({
      error: 'There was a problem resetting the test database.',
    });
  }
});

module.exports = router;