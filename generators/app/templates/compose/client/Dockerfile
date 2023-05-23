FROM node:18.16-alpine

RUN addgroup -S app && adduser -S app -G app

ENV HOME=/home/app

COPY frontend/package.json frontend/yarn.lock $HOME/client/

RUN mkdir $HOME/client/build

RUN chown -R app:app $HOME/*

USER app

WORKDIR $HOME/client

RUN yarn install

CMD ["yarn", "start"]
