#!/bin/sh
#Script to launch processes

./reservation -ipAddress=$4 -port=$3 -mongoAddress=$8 -memcachedAddress=$9 &
exec ./registration-client -process=reservation -service=hotel-reservation-reservation -register=false -server=$1 -port=$2 -hostname=$4 -register-port=$5 -latitude=$6 -longitude=$7
