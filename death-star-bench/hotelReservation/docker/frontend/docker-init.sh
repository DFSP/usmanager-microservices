#!/bin/sh
#Script to launch processes

./frontend -ipAddress=$4 -port=$3 &
exec ./registration-client -process=frontend -service=hotel-reservation-frontend -register=false -server=$1 -port=$2 -hostname=$4 -register-port=$5
