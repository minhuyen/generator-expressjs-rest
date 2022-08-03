FROM node:16.15-alpine

RUN addgroup -S app && adduser -S app -G app

ENV HOME=/home/app

# frontend/yarn.lock
COPY frontend/package.json $HOME/client/

RUN mkdir $HOME/client/build

RUN chown -R app:app $HOME/*

USER app

WORKDIR $HOME/client

RUN yarn install

CMD ["yarn", "start"]
