const Sequelize = require('sequelize');

module.exports = class User extends Sequelize.Model {//알아서 id를 기본키로 연결해주기에 적어줄 필요가 없다.
    static init(sequelize) {
        return super.init({
            loginId: {
                type: Sequelize.STRING(20),//varchar(20)
                allowNull: false,
                unique: true,
            },
            pw: {
                type: Sequelize.STRING(100),//varchar(50)
                allowNull: false,
            },
            name: {
                type: Sequelize.STRING(20),//varchar(20)
                allowNull: false,
            },
            age: {
                type: Sequelize.INTEGER.UNSIGNED,//int unsigned
                allowNull: true,
            },
            married: {
                type: Sequelize.BOOLEAN,//tinyint
                allowNull: false,
            },
            isAdmin: { // 관리자 = 1, 일반사용자 = 0
                type: Sequelize.BOOLEAN,//tinyint
                allowNull: false,
            }
        }, {//테이블 옵션
            sequelize,
            timestamps: true, //로우가 생성/수정될때 시간이 자동으로 입력된다.
            underscored: false, //테이블명 & 컬럼명을 스네이크 케이스로 바꿈(creaㄷted_at)
            modelName: 'User', //모델 이름 설정
            tableName: 'users', //테이블 명(소문자로 만듦)
            paranoid: true, //true -> deletedAt이라는 컬럼이 생성됨 .여기에 지운 시각이 기록됨. => 로우 복원 가능
            charset: 'utf8',
            collate: 'utf8_general_ci', //한글 입력
        });
    }
    static associate(db) {
        //1:N관계의 1에게 해당
        db.User.hasMany(db.Comment, { foreignKey: 'commenter', sourceKey: 'id' });//외래키 따로 지정X -> 모델명 + 기본키 = userId가 외래키로 생성됨.
    }
};