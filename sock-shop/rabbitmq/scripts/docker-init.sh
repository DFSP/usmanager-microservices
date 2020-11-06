#!/bin/sh
#Script to launch processes

./usr/local/bin/docker-entrypoint.sh rabbitmq-server &
exec ./registration-client -process=rabbitmq-server -service=SOCK_SHOP_RABBITMQ -server=$1 -port=$2 -hostname=$4
