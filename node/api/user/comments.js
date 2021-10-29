const User = require('../../models/user');
const Comment = require('../../models/comment');
const response = require("../../response");

const create = async (req, res, next) => {
    const user = await User.findOne({
        attributes: ['id'],
        where: { loginId: req.body.loginId },
    }).catch((err) => {
        console.error(err);
        return next(err);
    });
    if (!user) return response(res, 400, 'user is not exist');
    if (req.body.parentId == undefined) req.body.parentId = null;
    const comment = await Comment.create({
        commenter: user.id,
        comment: req.body.comment,
        parentId: req.body.parentId,
    }).catch((err) => {
        console.error(err);
        return next(err);
    });

    if (!comment) return response(res, 400, 'comment is not exist');
    return response(res, 201, comment);
}

const patch = async (req, res, next) => {
    const result = await Comment.update({
        comment: req.body.comment,
    }, {
        where: { id: req.params.id },
    }).catch((err) => {
        console.error(err);
        return next(err);
    });

    if (!result) return response(res, 400, 'comment is not exist');
    return response(res, 200, result);
}

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
        return next(err);
    });
    if (!result) return response(res, 403, 'cannot find id');
    return response(res, 200, result);
}

const read = async (req, res, next) => {
    const comments = await Comment.findAll({
        where: { parentId: req.params.id }
    }).catch((err) => {
        console.error(err);
        return next(err);
    });
    if (!comments) return response(res, 400, 'cannot find comment');
    return res.json(comments);
}
module.exports = {
    create,
    patch,
    remove,
    read
}