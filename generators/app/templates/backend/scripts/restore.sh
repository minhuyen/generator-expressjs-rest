#!/bin/bash

### Restore database from a backup.
###
### Parameters:
###     <1> filename of an existing backup.
###
### Usage:
###     $ docker-compose -f <environment>.yml (exec |run --rm) mongo restore <1>

set -e

DB="${MONGO_DATABASE}"
PASSWORD="${MONGO_INITDB_ROOT_PASSWORD}"
USERNAME="${MONGO_INITDB_ROOT_USERNAME}"
BACKUP_FOLDER="${MONGO_BACKUP_FOLDER}"

if [[ -z ${1+x} ]]; then
    echo "Backup filename is not specified yet it is a required parameter. Make sure you provide one and try again."
    exit 1
fi

backup_filename="${BACKUP_FOLDER}/${1}"

if [[ ! -f "${backup_filename}" ]]; then
    echo "No backup with the specified filename found. Check out the 'backups' maintenance script output to see if there is one and try again."
    exit 1
fi

echo "Restoring up MongoDB database"

echo "Restoring MongoDB $DB database to compressed archive"

mongorestore -h mongo -u $USERNAME -p $PASSWORD --authenticationDatabase admin -d $DB --gzip --drop --archive=$backup_filename

echo 'Restore complete!'
