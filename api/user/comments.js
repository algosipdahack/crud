const express = require('express');
const { User, Comment } = require('../../models');

const router = express.Router();

router.post('/', async (req, res, next) => {
    const user = await User.findOne({
        attributes: ['id'],
        where: { loginId: req.body.loginId },
    }).catch((err) => {
        console.error(err);
        next(err);
    });
    const comment = await Comment.create({
        commenter: user.id,
        comment: req.body.comment,
    }).catch((err) => {
        console.error(err);
        next(err);
    });
    res.status(201).json(comment);
});

router.route('/:id')
    .patch(async (req, res, next) => {
        const result = await Comment.update({
            comment: req.body.comment,
        }, {
            where: { id: req.params.id },
        }).catch((err) => {
            console.error(err);
            next(err);
        });
        res.json(result);
    })
    .delete(async (req, res, next) => {
        const result = await Comment.destroy({ where: { id: req.params.id } }).catch((err) => {
            console.error(err);
            next(err);
        });
        res.json(result);
    });

module.exports = router;