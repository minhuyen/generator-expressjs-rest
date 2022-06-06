###########
# BUILDER #
###########

# Setup and build the client

FROM node:16.15-alpine as builder

# set working directory
WORKDIR /home/node/app

COPY --chown=node:node frontend/package.json frontend/yarn.lock ./
RUN chown -R node:node /home/node/*

USER node

# RUN yarn upgrade caniuse-lite browserslist

RUN yarn install

COPY --chown=node:node frontend .

RUN yarn build

# Setup the server

FROM node:16.15-alpine

ENV NPM_CONFIG_PRODUCTION false

RUN apk update \
  # curl depenencies
  && apk add curl \
  # Git depenencies
  && apk add git \
  # mongo tools
  && apk add mongodb-tools

RUN addgroup -S app && adduser -S app -G app

RUN npm config set unsafe-perm true && npm install -g pm2

ENV HOME=/home/app

COPY backend/package*.json $HOME/<%=project_slug%>/
RUN chown -R app:app $HOME/*

USER app

WORKDIR $HOME/<%=project_slug%>

COPY --from=builder /home/node/app/build/ ./build/

RUN npm ci

COPY --chown=app:app backend .

RUN npm run build

CMD ["pm2-runtime", "processes.json"]
