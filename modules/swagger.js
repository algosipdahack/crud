const swaggerUi = require('swagger-ui-express');
const swaggereJsdoc = requires('swagger-jsdoc');
const options={
    swaggerDefinition:{
        info:{
            title: 'Test API',
            version: '1.0.0',
            description: 'Test API with express',
        },
        host: 'localhost:3002',
        basePath:'/'
    },
    apis: ['./route/*.js','./swagger/*']
};

const specs = swaggereJsdoc(options);
module.exports = {
    swaggerUi,
    specs
};
