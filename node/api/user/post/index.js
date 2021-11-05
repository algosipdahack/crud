const express = require('express');
const router = express.Router();
const controller = require('./post');
const { isLoggedIn, isNotLoggedIn } = require('../../../routes/middlewares');

router
    .post('/img', isLoggedIn, controller.upload.fields([{ name: 'img' }, { name: 'video' }]), controller.show)//img -> name속성
    .post('/', isLoggedIn, controller.upload2.none(), controller.post)
    .get('/:filename', isLoggedIn, controller.download);
module.exports = router;
