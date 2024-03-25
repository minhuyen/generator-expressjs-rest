#!/bin/bash
cd snap-boards-webapp
git pull
# docker compose -f docker-compose.prod.yml build
echo ${CI_REGISTRY_PASSWORD} | docker login $CI_REGISTRY --username $CI_REGISTRY_USERNAME --password-stdin
docker pull ${CI_REGISTRY_IMAGE}:staging
docker compose -f docker-compose.staging.yml up -d
docker image prune -f