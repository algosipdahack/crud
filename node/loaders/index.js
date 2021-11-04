const expressLoader = require('./express');
const sequelizeLoader = require('./sequelize');
const swaggerLoader = require('./swagger');
const passportLoader = require('./passport');

const init = async ({ expressApp }) => {
    await sequelizeLoader();
    await passportLoader({ app: expressApp });
    await expressLoader({ app: expressApp });
    await swaggerLoader({ app: expressApp });
};

module.exports = {
    init
}