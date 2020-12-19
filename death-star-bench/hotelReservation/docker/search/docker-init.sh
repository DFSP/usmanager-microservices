#!/bin/sh
#Script to launch processes

./search -port=$3 &
exec ./registration-client -process=search -service=HOTEL_RESERVATION_SEARCH -register=false -server=$1 -port=$5 -hostname=$4
