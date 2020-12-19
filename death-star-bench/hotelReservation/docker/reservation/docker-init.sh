#!/bin/sh
#Script to launch processes

./reservation -port=$3 &
exec ./registration-client -process=reservation -service=HOTEL_RESERVATION_RESERVATION -register=false -server=$1 -port=$5 -hostname=$4
