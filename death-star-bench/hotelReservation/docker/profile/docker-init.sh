#!/bin/sh
#Script to launch processes

./profile -port=$3 &
exec ./registration-client -process=profile -service=HOTEL_RESERVATION_PROFILE -register=false -server=$1 -port=$5 -hostname=$4
