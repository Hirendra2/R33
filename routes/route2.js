const express = require('express');
const router  = express.Router();

const Levelapi = require('../longchain');

router.post('/levelalo', Levelapi.levelalo);


module.exports = router;