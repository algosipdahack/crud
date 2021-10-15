const express = require('express');
const { User, Comment } = require('../../models');

const router = express.Router();

router.post('/', async (req, res, next) => {
    const comment = await Comment.create({
        commenter: req.body.id,//loginId
        comment: req.body.comment,
    }).catch((err) => {
        console.error(err);
        next(err);
    });
    console.log(comment);
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