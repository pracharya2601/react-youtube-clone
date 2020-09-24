const express = require('express');

const router = express.Router();

router.post('/signup', (req, res, next) => {
  const data = req.data;
  res.json({ message: 'successfull' });
});

router.post('/login', (req, res, next) => {
  const data = req.data;
  res.json({ message: 'successful' });
});

router.get('/:userId', (req, res, next) => {
  res.json({ message: 'successful' });
});

module.exports = router;
