const express = require('express');
const router = express.Router();
const controller = require('./users');
const { isLoggedIn, isNotLoggedIn } = require('../../../routes/middlewares');

router
    .get('/', controller.readAll)
    .post('/', isNotLoggedIn, controller.register)
    .get('/logout', controller.logout)
    //:id -> loginId
    .get('/:id', controller.read)
    .patch('/:id', isLoggedIn, controller.update)
    .delete('/:id', isLoggedIn, controller.remove)
    .get('/:id/comments', controller.commentRead) //댓글 보여줌

module.exports = router;