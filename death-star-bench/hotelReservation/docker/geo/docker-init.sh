#!/bin/sh
#Script to launch processes

./geo -ipAddress=$4 -port=$3 -mongoAddress=$6 &
exec ./registration-client -process=geo -service=hotel-reservation-geo -register=false -server=$1 -port=$2 -hostname=$4 -register-port=$5
