FROM nginx:1.25.2
RUN apt-get update && apt-get -y install nano
RUN mv /etc/nginx/conf.d/default.conf /etc/nginx/conf.d/default.conf.backup

ADD conf.d/ /etc/nginx/conf.d/