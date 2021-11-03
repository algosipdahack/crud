const User = require('../../models/user');
const Comment = require('../../models/comment');
const response = require("../../response");
const logger = require('../../config/winston');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
//post('/comments')
const create = async (req, res, next) => {
    const user = await User.findOne({
        attributes: ['id'],
        where: { loginId: req.body.loginId },
    }).catch((err) => {
        logger.error(err);
        console.error(err);
        return next(err);
    });
    if (!user) {
        logger.error('user is not exist');
        return response(res, 400, 'user is not exist');
    }
    if (req.body.parentId == undefined) req.body.parentId = null;
    const comment = await Comment.create({
        commenter: user.id,
        comment: req.body.comment,
        parentId: req.body.parentId,
    }).catch((err) => {
        logger.error(err);
        console.error(err);
        return next(err);
    });

    if (!comment) {
        logger.error('comment is not exist');
        return response(res, 400, 'comment is not exist');
    }
    logger.info('create /comments success');
    return response(res, 201, comment);
}

//patch('/comments/:id')
const patch = async (req, res, next) => {
    const result = await Comment.update({
        comment: req.body.comment,
    }, {
        where: { id: req.params.id },
    }).catch((err) => {
        logger.error(err);
        console.error(err);
        return next(err);
    });

    if (!result) {
        logger.error('comment is not exist');
        return response(res, 400, 'comment is not exist');
    }
    logger.info('patch /comments/id success');
    return response(res, 200, result);
}

//delete('/comments/:id')
const remove = async (req, res, next) => {
    const result = await Comment.destroy({
        where: {
            [Op.or]: [
                { id: req.params.id },
                { parentId: req.params.id }
            ]
        }
    }).catch((err) => {
        console.error(err);
        logger.error(err);
        return next(err);
    });
    if (!result) {
        logger.error('cannot find id');
        return response(res, 403, 'cannot find id');
    }
    logger.info('delete /comments/id success');
    return response(res, 200, result);
}

//대댓글 보여주기
//get('/comments/:id')
const read = async (req, res, next) => {
    const user = await User.findOne({
        where: {
            [Op.or]: [
                {//대댓글의 작성자가 삭제되었거나
                    id: req.query.id,
                    deletedAt: {
                        [Op.ne]: null
                    }
                }, {//댓글의 작성자가 삭제되었을 경우
                    parentId: req.query.id,
                    deletedAt: {
                        [Op.ne]: null
                    }
                }
            ]
        },
    }).catch((err) => {
        console.error(err);
        logger.error(err);
        return next(err);
    });
    if (!user) {
        logger.error('comment is not exist');
        return response(res, 400, 'comment is not exist');
    }
    const comments = await Comment.findAll({
        where: {
            id: req.query.id,
            parentId: req.params.id
        }
    }).catch((err) => {
        console.error(err);
        logger.error(err);
        return next(err);
    });
    if (!comments) {
        logger.error('cannot find comment');
        return response(res, 400, 'cannot find comment');
    }
    logger.info('read /comments/id success');
    return res.json(comments);
}
module.exports = {
    create,
    patch,
    remove,
    read
}