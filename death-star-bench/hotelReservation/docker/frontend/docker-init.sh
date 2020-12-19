#!/bin/sh
#Script to launch processes

./frontend -port=$3 &
exec ./registration-client -process=frontend -service=hotel-reservation-frontend -register=false -server=$1 -port=$5 -hostname=$4
