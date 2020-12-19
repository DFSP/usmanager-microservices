#!/bin/sh
#Script to launch processes

./user -port=$3 &
exec ./registration-client -process=user -service=hotel-reservation-user -register=false -server=$1 -port=$5 -hostname=$4
