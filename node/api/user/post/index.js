const express = require('express');
const router = express.Router();
const controller = require('./post');
const { isLoggedIn, isNotLoggedIn } = require('../../../routes/middlewares');

router
    .post('/img', isLoggedIn, controller.upload.single('img'), controller.show)
    .post('/', isLoggedIn, controller.upload2.none(), controller.post)

module.exports = router;
