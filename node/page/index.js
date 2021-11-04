const express = require('express');
const router = express.Router();

const indexRouter = require('./join');
const loginRouter = require('./login');
const verifyRouter = require('./verify');

router.use('/', indexRouter);
router.use('/login', loginRouter);
router.use('/verify', verifyRouter);

module.exports = router;