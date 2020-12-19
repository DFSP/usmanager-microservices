#!/bin/sh
#Script to launch processes

java -Djava.security.egd=file:/dev/urandom -jar ./shipping.jar --port=$3 --rabbithost=$6 &
exec ./registration-client -process=java -service=sock-shop-shipping -register=false -server=$1 -port=$5 -hostname=$4
