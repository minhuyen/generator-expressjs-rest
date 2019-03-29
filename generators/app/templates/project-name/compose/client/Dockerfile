FROM node:10.15.0-alpine

RUN addgroup -S app && adduser -S app -G app

ENV HOME=/home/app

COPY package.json yarn.lock $HOME/client/

RUN mkdir $HOME/client/build

RUN chown -R app:app $HOME/*

USER app

WORKDIR $HOME/client

RUN yarn install

CMD ["yarn", "start"]
