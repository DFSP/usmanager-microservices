#!/bin/sh
#Script to launch processes

./payment -port=$3 &
exec ./registration-client -process=payment -service=sock-shop-payment -register=false -server=$1 -port=$5 -hostname=$4