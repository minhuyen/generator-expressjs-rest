#!/bin/bash
cd <%=project_slug%>
git pull
echo ${CI_REGISTRY_PASSWORD} | docker login $CI_REGISTRY --username $CI_REGISTRY_USERNAME --password-stdin
docker pull ${CI_REGISTRY_IMAGE}:latest
docker compose -f docker-compose.prod.yml up -d
docker image prune -f