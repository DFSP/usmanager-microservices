#!/bin/sh
#Script to launch processes

./catalogue -port=$3 -DSN=$6 &
exec ./registration-client -process=catalogue -service=sock-shop-catalogue -register=false -server=$1 -port=$2 -hostname=$4 -register-port=$5
