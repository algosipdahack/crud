const express = require('express');
const router = express.Router();
const controller = require('./auth');
const { isLoggedIn, isNotLoggedIn } = require('../../routes/middlewares');

router
    .post('/token', isNotLoggedIn, controller.create)
    .get('/token', isLoggedIn, controller.verify)
    .patch('/levelup', isLoggedIn, controller.levelup)
    
module.exports = router;