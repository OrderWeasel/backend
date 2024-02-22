const express = require('express');

// for reset route - development only
const fs = require('fs');
const path = require('path');
const db = require('../../../config/db');

const sqlFilePath = path.resolve('database/database.sql');
const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const sqlFile = fs.readFileSync(sqlFilePath, 'utf8');
    const commands = sqlFile.split(';');
    const queries = [];
    for (let i = 0; i < commands.length; i += 1) {
      const command = commands[i];
      queries.push(db.query(command));
    }
    await Promise.all(queries);
    res.status(200).json({ success: 'Database reset successfully...' });
  } catch (e) {
    console.log(e);
    res.status(400).json({
      error: 'There was a problem restting the test database.',
    });
  }
});
