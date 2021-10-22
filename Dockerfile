FROM node:14

WORKDIR /

COPY /package.json .

RUN npm install
RUN npm install express morgan nunjucks sequelize sequelize-cli mysql2 passport passport-local bcrypt dotenv express-session cookie-parser

COPY / .

CMD [ "npm", "start" ]