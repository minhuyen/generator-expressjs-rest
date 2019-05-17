FROM node:10.15.0-alpine

RUN addgroup -S app && adduser -S app -G app

ENV HOME=/home/app

COPY package.json package-lock.json $HOME/<%=project_slug%>/
RUN chown -R app:app $HOME/*

USER app
WORKDIR $HOME/<%=project_slug%>
RUN npm install

CMD ["npm", "start"]
