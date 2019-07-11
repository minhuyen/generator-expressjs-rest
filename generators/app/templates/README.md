# <%=project_slug%>

<%=project_slug%>

### Prerequisites

- [Docker (at least 1.10)](https://www.docker.com/)
- [Docker-compose (at least 1.6)](https://docs.docker.com/compose/install/)

## Getting Started

To get up and running on local, simply do the following:

    $ cd <%=project_slug%>
    # build docker images
    $ docker-compose build
    $ docker-compose up

## Deployment

ssh to server

    $ cd ~/<%=project_slug%>
    $ git pull origin develop
    $ docker-compose -f docker-compose.dev.yml build
    $ docker-compose -f docker-compose.dev.yml up -d
