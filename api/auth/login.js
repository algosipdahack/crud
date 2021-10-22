var express = require('express');
const User = require('../../models/user');
const router = express.Router();

router.route('/:id')
    .get(async (req, res, next) => {
        const id = req.params.id;
        const user = await User.findOne({
            where: {
                loginId: id,
            },
        }).catch((e) => {
            console.log(e);
            res.status(500).json({ status: false, result: 'No user' });
        });
        res.json(user);
    });

router.get('/', async (req, res, next) => {//get방식 라우터
    const users = await User.findAll().catch((err) => {
        console.error(err);
        next(err);
    });
    res.render('login', { users });
});
module.exports = router;