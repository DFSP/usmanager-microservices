#!/bin/sh
#Script to launch processes

./recommendation -port=$3 &
exec ./registration-client -process=recommendation -service=HOTEL_RESERVATION_RECOMMENDATION -register=false -server=$1 -port=$5 -hostname=$4
