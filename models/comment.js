const Sequelize = require('sequelize');

module.exports = class Comment extends Sequelize.Model{//commenter가 없음. 뭔가 이상함 -> commenter은 foreignKey로 사용되었기 때문이다.
    static init(sequelize){
        return super.init({
            comment:{
                type:Sequelize.STRING(100),//varchar(100)
                allowNull: false,
            },
            created_at:{
                type: Sequelize.DATE,//datetime
                allowNull: true,
                defaultValue: Sequelize.NOW,
            },
        },{
            sequelize,
            timestamps:false,
            modelName: 'Comment',
            tableName: 'coomments',
            paranoid: false,
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci',
        });
    }
    static associate(db){
        db.Comment.belongsTo(db.User,{foreignKey:'commenter',targetKey:'id'});//1:N관계의 N에게 해당-> 다른 모델의 정보가 들어가는 테이블에 사용. ex) User의 정보가 Comments에 들어가기 때문이다.
        //belongsTo에서 외래키를 선정함.
    }
};