#!/bin/sh
#Script to launch processes

./app -port=$3 &
exec ./registration-client -process=app -service=SOCK_SHOP_PAYMENT -register=false -server=$1 -port=$2 -hostname=$4
