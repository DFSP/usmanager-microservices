#!/bin/sh
#Script to launch processes

./search -ipAddress=$4 -port=$3 &
exec ./registration-client -process=search -service=hotel-reservation-search -register=false -server=$1 -port=$2 -hostname=$4 -register-port=$5
