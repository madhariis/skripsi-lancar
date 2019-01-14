FROM node:latest

RUN mkdir /app

WORKDIR /app

COPY ./app/package*.json ./

RUN npm install
RUN npm install pm2

WORKDIR /

EXPOSE ${BACKEND_PORT}

COPY start.dev.json ./
COPY start.prod.json ./

CMD [ "npm", "start" ]
