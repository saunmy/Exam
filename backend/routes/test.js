// backend/routes/test.js
const express = require('express');
const router = express.Router();

router.get('/hello', (req, res) => {
  res.send('Hello from test route');
});

module.exports = router;
