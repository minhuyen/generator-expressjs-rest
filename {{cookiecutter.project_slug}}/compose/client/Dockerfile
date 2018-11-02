FROM node:8.12.0-alpine

RUN addgroup -S app && adduser -S app -G app
ENV HOME=/home/app

COPY package.json yarn.lock $HOME/client/
RUN chown -R app:app $HOME/*

USER app
WORKDIR $HOME/client
RUN yarn install

CMD ["yarn", "start"]
