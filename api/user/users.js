const express = require('express');
const User = require('../../models/user');
const Comment = require('../../models/comment');

const router = express.Router();

router.get('/', async (req, res, next) => {
  const users = await User.findAll().catch((err) => {
    console.error(err);
    next(err);
  });
  res.json(users);
});

router.get('/:id', async (req, res, next) => {
  const id = req.params.id;
  const user = await User.findOne({
    where: { id: id },
  }).catch((err) => {
    console.error(err);
    next(err);
  });
  console.log(user);
  return user;
})

router.get('/:id/comments', async (req, res, next) => {
  const comments = await Comment.findAll({
    include: {
      model: User,
      where: { id: req.params.id },
    },
  }).catch((err) => {
    console.error(err);
    next(err);
  });
  res.json(comments);
});

module.exports = router;
