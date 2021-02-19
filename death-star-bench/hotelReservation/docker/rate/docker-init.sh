#!/bin/sh
#Script to launch processes

./rate -ipAddress=$4 -port=$3 -mongoAddress=$7 -memcachedAddress=$8 &
exec ./registration-client -process=rate -service=hotel-reservation-rate -register=false -server=$1 -port=$2 -hostname=$4 -register-port=$5 -latitude=$6 -longitude=$7
