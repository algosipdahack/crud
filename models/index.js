const Sequelize = require('sequelize');
const User = require('./user');
const Comment = require('./comment');

const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];
const db = {};

const sequelize = new Sequelize(config.database, config.username, config.password, config);

db.sequelize = sequelize;
db.User = User;
db.Comment = Comment;

//static.init메서드를 호출
User.init(sequelize);
Comment.init(sequelize);

//다른 테이블과의 관계를 연결
User.associate(db);
Comment.associate(db);

module.exports = db;