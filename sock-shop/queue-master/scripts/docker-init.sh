#!/bin/sh
#Script to launch processes

java -Djava.security.egd=file:/dev/urandom -jar ./queue-master.jar --port=$3 --rabbithost=$6 &
exec ./registration-client -process=java -service=sock-shop-queue-master -register=false -server=$1 -port=$2 -hostname=$4 -register-port=$5
