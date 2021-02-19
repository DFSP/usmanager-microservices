#!/bin/sh
#Script to launch processes

./payment -port=$3 &
exec ./registration-client -process=payment -service=sock-shop-payment -register=false -server=$1 -port=$2 -hostname=$4 -register-port=$5 -latitude=$6 -longitude=$7