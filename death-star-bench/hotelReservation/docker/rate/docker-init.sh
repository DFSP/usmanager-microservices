#!/bin/sh
#Script to launch processes

./rate -ipAddress=$4 -port=$3 -mongoAddress=$6 -memcachedAddress=$7 &
exec ./registration-client -process=rate -service=hotel-reservation-rate -register=false -server=$1 -port=$5 -hostname=$4
