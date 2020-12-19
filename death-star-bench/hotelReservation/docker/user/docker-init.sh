#!/bin/sh
#Script to launch processes

./user -port=$3 &
exec ./registration-client -process=user -service=HOTEL_RESERVATION_USER -register=false -server=$1 -port=$5 -hostname=$4
