FROM node:8.12.0-alpine

RUN addgroup -S app && adduser -S app -G app

RUN npm install -g pm2

RUN apk add --update \
    python \
    python-dev \
    py-pip \
    build-base

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

CMD ["pm2", "start", "--no-daemon", "processes.json"]
