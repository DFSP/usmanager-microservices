#!/bin/sh
#Script to launch processes

yarn node dist/server.js &
exec ./registration-client -process=node -service=SOCK_SHOP_FRONT_END -register=false -server=$1 -port=$2 -hostname=$4
