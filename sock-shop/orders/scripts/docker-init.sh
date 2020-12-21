#!/bin/sh
#Script to launch processes

java -Djava.security.egd=file:/dev/urandom -jar ./orders.jar --port=$3 --db=$6 &
exec ./registration-client -process=java -service=sock-shop-orders -register=false -server=$1 -port=$2 -hostname=$4 -register-port=$5
