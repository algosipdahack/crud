const { swaggerUi, specs } = require('../modules/swagger');

module.exports = async ({ app }) => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
    return app;
}