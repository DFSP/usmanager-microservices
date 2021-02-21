#!/bin/sh
#Script to launch processes

yarn node dist/server.js &
exec ./registration-client -process=node -service=sock-shop -register=false -server=$1 -port=$2 -hostname=$4 -register-port=$5 -latitude=$6 -longitude=$7
