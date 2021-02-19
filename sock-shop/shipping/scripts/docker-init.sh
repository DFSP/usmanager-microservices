#!/bin/sh
#Script to launch processes

java -Djava.security.egd=file:/dev/urandom -jar ./shipping.jar --port=$3 --rabbithost=$8 &
exec ./registration-client -process=java -service=sock-shop-shipping -register=false -server=$1 -port=$2 -hostname=$4 -register-port=$5 -latitude=$6 -longitude=$7
