const express = require('express');
const router = express.Router();


const user = require('./user/users');
const comment = require('./user/comments');
const auth = require('./auth');
const upload = require('./user/post')

router.use('/users', user)
router.use('/comments', comment)
router.use('/auth', auth)
router.use('/post', upload)

module.exports = router;
