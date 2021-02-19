#!/bin/sh
#Script to launch processes

./profile -ipAddress=$4 -port=$3 -mongoAddress=$8 -memcachedAddress=$9 &
exec ./registration-client -process=profile -service=hotel-reservation-profile -register=false -server=$1 -port=$2 -hostname=$4 -register-port=$5 -latitude=$6 -longitude=$7
