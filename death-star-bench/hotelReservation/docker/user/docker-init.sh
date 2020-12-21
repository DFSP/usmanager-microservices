#!/bin/sh
#Script to launch processes

./user -ipAddress=$4 -port=$3 -mongoAddress=$6 &
exec ./registration-client -process=user -service=hotel-reservation-user -register=false -server=$1 -port=$2 -hostname=$4 -register-port=$5
