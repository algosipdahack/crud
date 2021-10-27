const { User, Comment } = require('../../models');
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
    const comment = await Comment.create({
        commenter: user.id,
        comment: req.body.comment,
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
    const result = await Comment.destroy({ where: { id: req.params.id } }).catch((err) => {
        console.error(err);
        return next(err);
    });
    if (!result) return response(res, 403, 'cannot find id');
    return response(res, 200, result);
}
module.exports = {
    create,
    patch,
    remove
}