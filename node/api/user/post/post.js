const fs = require('fs');
const multer = require('multer');
const path = require('path');
const Comment = require('../../../models/comment');
const response = require("../../../response");
const logger = require('../../../config/winston');

try {
    fs.readdirSync('uploads');
} catch (error) {
    console.error('uploads폴더가 없어 생성합니다.');
    fs.mkdirSync('uploads');
}

const upload = multer({
    storage: multer.diskStorage({
        destination(req, file, cb) {//저장경로 설정
            cb(null, 'uploads/');
        },
        filename(req, file, cb) {//파일명 설정
            const ext = path.extname(file.originalname);
            cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
        },
    }),
    limits: { fileSize: 5 * 1024 * 1024 },
});

const show = async (req, res, next) => {
    console.log(req.file);
    res.json({ url: `/img/${req.file.filename}` });
}

const upload2 = multer();

const post = async (req, res, next) => {
    const post = await Comment.create({
        comment: req.body.comment,
        img: req.body.img,
        parentId : req.body.parentId,
    }).catch((err) => {
        logger.error(err);
        console.error(err);
        return next(err);
    });
    if (!post) {
        logger.error('comment is not exist');
        return response(res, 400, 'comment is not exist');
    }
    logger.info('create /post success');
    return response(res, 201, post);
}

module.exports = {
    upload,
    upload2,
    show,
    post
}