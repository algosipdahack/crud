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
    logger.error('uploads폴더가 없어 생성합니다.');
    fs.mkdirSync('uploads');
}

const fileFilter = (req, file, callback) => {
    const typeArray = file.mimetype.split('/');
    const fileType = typeArray[1]; // 이미지&동영상 확장자 추출
    //이미지&동영상 확장자 구분 검사
    if (fileType == 'jpg' || fileType == 'jpeg' || fileType == 'png' || fileType == 'mp4') {
        callback(null, true)
    } else {
        return callback({ message: "*.jpg, *.jpeg, *.png, *.mp4파일만 업로드가 가능합니다." }, false)
    }
}

const upload = multer({
    storage: multer.diskStorage({
        destination(req, file, cb) {//저장경로 설정
            cb(null, 'uploads/');
        },
        filename(req, file, cb) {//파일명 설정
            const ext = path.extname(file.originalname);//파일 확장자 추출. originalname -> 사용자가 업로드한 파일 명
            cb(null, path.basename(file.originalname, ext) + Date.now() + ext);//겹칠 수도 있으니 시간을 정수로 달아줌
        },
    }),
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: fileFilter
});


//.post('/post/img')
const show = async (req, res, next) => {
    console.log(req.files);
    res.json({ url: `/img/${req.file.filename}` });
}

const upload2 = multer();

//.post('/post')
const post = async (req, res, next) => {
    const post = await Comment.create({
        comment: req.body.comment,
        img: req.body.img,
        parentId: req.body.parentId,
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

const download = (req, res, next) => {
    const filename = __dirname + '/uploads/' + req.params.filename;
    res.download(filename);
}

module.exports = {
    upload,
    upload2,
    show,
    post,
    download
}