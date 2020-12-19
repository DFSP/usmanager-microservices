#!/bin/sh
#Script to launch processes

./search -port=$3 &
exec ./registration-client -process=search -service=hotel-reservation-search -register=false -server=$1 -port=$5 -hostname=$4
