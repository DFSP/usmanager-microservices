#!/bin/sh
#Script to launch processes

java -Djava.security.egd=file:/dev/urandom -jar ./carts.jar --port=$3 --db=$5 &
exec ./registration-client -process=java -service=SOCK_SHOP_CARTS -register=false -server=$1 -port=$6 -hostname=$4
