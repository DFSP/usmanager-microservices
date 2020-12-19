#!/bin/sh
#Script to launch processes

./profile -port=$3 &
exec ./registration-client -process=profile -service=hotel-reservation-profile -register=false -server=$1 -port=$5 -hostname=$4
