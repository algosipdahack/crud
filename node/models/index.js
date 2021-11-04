const Sequelize = require('sequelize');
const User = require('./user');
const Comment = require('./comment');
const dbConfig = require("../config/db.config.js");

const env = process.env.NODE_ENV || 'development';
const db = {};

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    port: dbConfig.port,
    operatorsAliases: 0,
    // dialectOptions: {
    //     options: {
    //         requestTimeout: 3000
    //     }
    // },
    pool: {
        max: dbConfig.pool.max,
        min: dbConfig.pool.min,
        acquire: dbConfig.pool.acquire,
        idle: dbConfig.pool.idle
    }
});

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