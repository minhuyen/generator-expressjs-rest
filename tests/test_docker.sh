#!/bin/sh
# this is a very simple script that tests the docker configuration for cookiecutter-django
# it is meant to be run from the root directory of the repository, eg:
# sh tests/test_docker.sh

set -o errexit
set -x


# create a cache directory
mkdir -p .cache/docker
cd .cache/docker


# create the project using the default settings in cookiecutter.json
yo ../../generators/app --no-input
 
cd expressjs_boilerplate

# run the project's tests
docker-compose -f docker-compose.test.yml build
docker-compose -f docker-compose.test.yml run --rm node npm run test
docker-compose -f docker-compose.test.yml down