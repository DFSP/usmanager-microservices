package main

import (
	"flag"
	"fmt"
	"github.com/usmanager/microservices/death-star-bench/hotelReservation/services/frontend"
	"log"
)

var port int
var ipAddress string

func init() {
	flag.IntVar(&port, "port", 5000, "The server port")
	flag.StringVar(&ipAddress, "ipAddress", "127.0.0.1", "The server address")
}

func main() {
	flag.Parse()

	fmt.Printf("frontend ip = %s, port = %d\n", ipAddress, port)

	srv := &frontend.Server{
		IpAddr: ipAddress,
		Port:   port,
	}

	log.Fatal(srv.Run())
}
