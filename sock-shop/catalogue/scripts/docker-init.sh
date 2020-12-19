#!/bin/sh
#Script to launch processes

./catalogue -port=$3 -DSN=$6 &
exec ./registration-client -process=catalogue -service=SOCK_SHOP_CATALOGUE -register=false -server=$1 -port=$5 -hostname=$4
