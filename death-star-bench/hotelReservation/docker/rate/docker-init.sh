#!/bin/sh
#Script to launch processes

./rate -port=$3 &
exec ./registration-client -process=rate -service=HOTEL_RESERVATION_RATE -register=false -server=$1 -port=$5 -hostname=$4
