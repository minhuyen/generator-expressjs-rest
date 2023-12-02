###########
# BUILDER #
###########

# Setup and build the client

FROM node:18.19-alpine as builder

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

FROM node:18.19-alpine

ENV NPM_CONFIG_PRODUCTION false

RUN apk update \
  # curl depenencies
  && apk add curl \
  # Git depenencies
  && apk add git \
  # mongo tools
  && apk add mongodb-tools

RUN addgroup -S app && adduser -S app -G app

# RUN npm config set unsafe-perm true

RUN npm install -g pm2

ENV HOME=/home/app

COPY backend/package*.json $HOME/<%=project_slug%>/
RUN chown -R app:app $HOME/*

USER app

WORKDIR $HOME/<%=project_slug%>

COPY --from=builder /home/node/app/build/ ./build/

# Safe install
RUN npm ci && npm cache clean --force

COPY --chown=app:app backend .

RUN npm run build

# Clean dev packages
RUN npm prune --production

EXPOSE 3000

CMD ["pm2-runtime", "processes.json"]
