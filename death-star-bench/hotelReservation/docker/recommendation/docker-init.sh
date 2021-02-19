#!/bin/sh
#Script to launch processes

./recommendation -ipAddress=$4 -port=$3 -mongoAddress=$8 &
exec ./registration-client -process=recommendation -service=hotel-reservation-recommendation -register=false -server=$1 -port=$2 -hostname=$4 -register-port=$5 -latitude=$6 -longitude=$7
