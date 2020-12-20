#!/bin/sh
#Script to launch processes

./recommendation -ipAddress=$4 -port=$3 -mongoAddress=$6 &
exec ./registration-client -process=recommendation -service=hotel-reservation-recommendation -register=false -server=$1 -port=$5 -hostname=$4
