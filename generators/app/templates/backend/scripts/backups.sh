#!/bin/bash

### View backups.
###
### Usage:
###     $ docker-compose -f <environment>.yml (exec |run --rm) mongo backups

BACKUP_FOLDER="${MONGO_BACKUP_FOLDER}"

echo "These are the backups you have got:"

ls -lht "${BACKUP_FOLDER}"
