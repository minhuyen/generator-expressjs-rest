FROM node:8.12.0-alpine

RUN addgroup -S app && adduser -S app -G app
RUN npm install -g pm2

ENV HOME=/home/app

COPY package.json package-lock.json $HOME/dating/
RUN chown -R app:app $HOME/*

USER app
WORKDIR $HOME/dating
RUN npm install


USER root
COPY . $HOME/dating
RUN chown -R app:app $HOME/*
USER app

CMD ["pm2", "start", "--no-daemon", "processes.json"]
