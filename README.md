# Cookiecutter Expressjs

[![Build Status](https://travis-ci.org/minhuyen/cookiecutter-expressjs.svg?branch=develop)](https://travis-ci.org/minhuyen/cookiecutter-expressjs)

### Features ###

* User Registration
* Basic Authentication with username and password
* Admin use [react-admin](https://github.com/marmelab/react-admin)
* Oauth 2.0 Authentication
  * Facebook
  * Google
* Upload Photo to S3 amazon
* Docker 

### Prerequisites

- [Docker (at least 1.10)](https://www.docker.com/)
- [Docker-compose (at least 1.6)](https://docs.docker.com/compose/install/)
- [python](https://www.python.org/)
- [pip](https://pip.pypa.io/en/stable/installing/)

## Getting Started

To get up and running on local, simply do the following:

    $ pip install cookiecutter
	$ cookiecutter https://github.com/minhuyen/cookiecutter-expressjs.git
	$ cd your-project-name
	# build docker images
	$ docker-compose build
	$ docker-compose run --rm client npm run build
	$ docker-compose up
