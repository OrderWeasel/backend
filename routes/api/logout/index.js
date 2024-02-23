const express = require('express');

const router = express.Router();

router.post('/:id', async (req, res) => {
  // Verify auth
  if (Number(req.session.user) === Number(req.params.id)) {
    // clear the session.
    req.session.destroy();
    res.status(200).json({
      message: 'Successfully logged out!',
      isLoggedIn: false,
    });
  } else {
    res.status(401).json({ error: 'Unauthorized request.' });
  }
});

module.exports = router;
