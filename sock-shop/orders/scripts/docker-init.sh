#!/bin/sh
#Script to launch processes

java -Djava.security.egd=file:/dev/urandom -jar ./orders.jar --port=$3 --db=$6 &
exec ./registration-client -process=java -service=SOCK_SHOP_ORDERS -register=false -server=$1 -port=$5 -hostname=$4
