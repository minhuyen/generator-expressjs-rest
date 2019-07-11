FROM node:10.15.0-alpine

ENV NPM_CONFIG_PRODUCTION false

RUN addgroup -S app && adduser -S app -G app

RUN npm config set unsafe-perm true && npm install -g pm2

ENV HOME=/home/app

COPY package.json package-lock.json $HOME/<%=project_slug%>/
RUN chown -R app:app $HOME/*

USER app
WORKDIR $HOME/<%=project_slug%>
RUN npm install

COPY --chown=app:app . .

CMD ["pm2", "start", "--no-daemon", "processes.json"]
