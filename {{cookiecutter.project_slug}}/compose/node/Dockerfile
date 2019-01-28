FROM node:10.15.0-alpine

ENV NPM_CONFIG_PRODUCTION false

RUN addgroup -S app && adduser -S app -G app

RUN apk update && apk upgrade \
	&& apk --no-cache add --virtual builds-deps build-base python

RUN npm config set unsafe-perm true && npm install -g pm2

ENV HOME=/home/app

COPY package.json package-lock.json $HOME/{{cookiecutter.project_slug}}/
RUN chown -R app:app $HOME/*

USER app
WORKDIR $HOME/{{cookiecutter.project_slug}}
RUN npm install

RUN npm rebuild bcrypt --build-from-source

USER root
COPY . $HOME/{{cookiecutter.project_slug}}
RUN chown -R app:app $HOME/*
USER app

RUN cd src/client && npm install 

RUN cd src/client && npm run build

CMD ["pm2", "start", "--no-daemon", "processes.json"]
