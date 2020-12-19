#!/bin/sh
#Script to launch processes

java -Djava.security.egd=file:/dev/urandom -jar ./queue-master.jar --port=$3 --rabbithost=$6 &
exec ./registration-client -process=java -service=SOCK_SHOP_QUEUE_MASTER -register=false -server=$1 -port=$5 -hostname=$4
