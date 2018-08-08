FROM node:6.9.5

RUN useradd --user-group --create-home --shell /bin/false app &&\
  npm install -g pm2

ENV HOME=/home/app

COPY package.json npm-shrinkwrap.json $HOME/{{cookiecutter.project_slug}}/
RUN chown -R app:app $HOME/*

USER app
WORKDIR $HOME/{{cookiecutter.project_slug}}
RUN npm install


USER root
COPY . $HOME/{{cookiecutter.project_slug}}
RUN chown -R app:app $HOME/*
USER app

CMD ["pm2", "start", "--no-daemon", "processes.json"]
