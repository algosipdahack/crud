const express = require('express');
const User = require('../../models/user');
const Comment = require('../../models/comment');

const router = express.Router();

router.route('/')
  .get(async (req, res, next) => {
    const users = await User.findAll().catch((err) => {
      console.error(err);
      next(err);
    });
    res.json(users);
  })
  .post(async (req, res, next) => {
    const user = await User.create({
      loginId: req.body.loginId,
      pw: req.body.pw,
      name: req.body.name,
      age: req.body.age,
      married: req.body.married,
    }).catch((err) => {
      console.error(err);
      next(err);
    });
    console.log(user);
    res.status(201).json(user);
  });

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
  console.log(comments);
  res.json(comments);
});

module.exports = router;
