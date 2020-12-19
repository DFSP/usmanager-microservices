#!/bin/sh
#Script to launch processes

./recommendation -port=$3 &
exec ./registration-client -process=recommendation -service=hotel-reservation-recommendation -register=false -server=$1 -port=$5 -hostname=$4
