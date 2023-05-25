#!/bin/bash
cd <%=project_slug%>
git pull
docker compose -f docker-compose.prod.yml build
docker compose -f docker-compose.prod.yml up -d;
