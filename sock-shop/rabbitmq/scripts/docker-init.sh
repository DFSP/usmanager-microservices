#!/bin/sh
#Script to launch processes

./usr/local/bin/docker-entrypoint.sh rabbitmq-server &
exec ./registration-client -process=rabbitmq-server -service=sock-shop-rabbitmq -server=$1 -port=$5 -hostname=$4
