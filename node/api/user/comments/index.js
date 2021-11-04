const express = require('express');
const router = express.Router();
const controller = require('./comments');
const { isLoggedIn, isNotLoggedIn } = require('../../../routes/middlewares');

router
    .post('/', isLoggedIn, controller.create)
    .get('/:id', isLoggedIn, controller.read) //대댓글 보여줌
    .patch('/:id', isLoggedIn, controller.patch)
    .delete('/:id', isLoggedIn, controller.remove)

module.exports = router;