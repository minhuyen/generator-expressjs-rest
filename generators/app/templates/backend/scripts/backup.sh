#!/bin/bash

### Create a database backup.
###
### Usage:
###     $ docker-compose -f <environment>.yml (exec |run --rm) mongo backup

set -e

BACKUP_NAME="backup_$(date +'%Y_%m_%dT%H_%M_%S').gz"
DB="${MONGO_DATABASE}"
PASSWORD="${MONGO_INITDB_ROOT_PASSWORD}"
USERNAME="${MONGO_INITDB_ROOT_USERNAME}"
BACKUP_FOLDER="${MONGO_BACKUP_FOLDER}"

echo "Backing up MongoDB database"

echo "Dumping MongoDB $DB database to compressed archive"
mongodump -h mongo -u $USERNAME -p $PASSWORD --authenticationDatabase admin --db $DB --gzip --archive="$BACKUP_FOLDER/$BACKUP_NAME"

# Delete backups created 5 or more days ago
find $BACKUP_FOLDER -mindepth 1 -mtime +3 -delete

echo 'Backup complete!'
