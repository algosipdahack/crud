const express = require('express');
const path = require('path');
const morgan = require('morgan');
const nunjucks = require('nunjucks');
const api = require('../api');
const routes = require('../page');
const PORT = process.env.NODE_DOCKER_PORT || 8080;
var cookieParser = require('cookie-parser');
require("dotenv").config();

module.exports = async ({ app }) => {
    app.use(morgan('dev'));
    app.use(express.static(path.join(__dirname, 'public')));
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(cookieParser())
    app.use('/', routes);
    app.use('/', api);

    app.use((req, res, next) => {
        const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
        error.status = 404;
        next(error);
    });

    //error handling
    app.use((err, req, res, next) => {
        res.locals.message = err.message;
        res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};
        res.status(err.status || 500);
        res.render('error');
    });

    // view engine setup
    app.set('view engine', 'html');
    nunjucks.configure('views', {
        express: app,
        watch: true,
    });

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}.`);
    });

    return app;
}