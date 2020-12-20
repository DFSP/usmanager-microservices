package main

import (
	"flag"
	"fmt"
	"github.com/usmanager/microservices/death-star-bench/hotelReservation/services/search"
	"log"
)

var ipAddress string
var port int

func init() {
	flag.StringVar(&ipAddress, "ipAddress", "127.0.0.1", "The server ip address")
	flag.IntVar(&port, "port", 8082, "The server port")
}

func main() {
	flag.Parse()

	fmt.Printf("rate ip = %s, port = %d\n", ipAddress, port)

	srv := &search.Server{
		IpAddr:       ipAddress,
		Port:         port,
	}

	log.Fatal(srv.Run())
}
