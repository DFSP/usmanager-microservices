#!/bin/sh
#Script to launch processes

./catalogue -port=$3 -DSN=$8 &
exec ./registration-client -process=catalogue -service=sock-shop-catalogue -register=false -server=$1 -port=$2 -hostname=$4 -register-port=$5 -latitude=$6 -longitude=$7
