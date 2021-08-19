var express = require('express');
var router = express.Router();

const handle = (req, res) => {
  res.json({ index: 'ok' });
}

router.get('/', handle);

module.exports = router;
