#!/bin/sh
#Script to launch processes

./geo -port=$3 &
exec ./registration-client -process=geo -service=HOTEL_RESERVATION_GEO -register=false -server=$1 -port=$5 -hostname=$4
