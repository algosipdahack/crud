const express = require('express');
const router = express.Router();
const controller = require('./comments');
const { isLoggedIn, isNotLoggedIn } = require('../../routes/middlewares');

router
    .post('/auth/token', isNotLoggedIn, controller.create)
    .get('/auth/token', isLoggedIn, controller.verify)

module.exports = router;