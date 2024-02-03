const path = require('path');

var express = require('express');
var router = express.Router();

router.use('/api/', require('./api'))
router.get('/', (req, res) => { res.sendFile(path.join(__dirname, '../../public/index.html')) })

module.exports = router;