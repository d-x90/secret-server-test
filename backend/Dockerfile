FROM node:14

WORKDIR /usr/src/app

COPY . .
RUN rm .env

RUN npm install

EXPOSE ${SERVER_PORT}

CMD [ "npm", "start" ]