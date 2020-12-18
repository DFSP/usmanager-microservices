#!/bin/sh
#Script to launch processes

./frontend -port=$3 -DSN=$5 &
exec ./registration-client -process=frontend -service=HOTEL_RESERVATION_FRONTEND -register=false -server=$1 -port=$5 -hostname=$4
