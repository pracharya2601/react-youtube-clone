const express = require('express');
const router = express.Router();

router.get('/messages', (req, res, next) => {
  res.json({ message: 'successful' });
});

module.exports = router;
