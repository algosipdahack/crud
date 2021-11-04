FROM node:14

ADD https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh /

WORKDIR /

COPY /package.json .

RUN npm install && npm install nodemon -g

COPY / .

# CMD [ "npm", "start" ]
