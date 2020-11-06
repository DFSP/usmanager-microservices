#!/bin/sh
#Script to launch processes

java -Djava.security.egd=file:/dev/urandom -jar ./shipping.jar --port=$3 --rabbithost=$5 &
exec ./registration-client -process=java -service=SOCK_SHOP_SHIPPING -register=false -server=$1 -port=$2 -hostname=$4
