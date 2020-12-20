package main

import (
	"flag"
	"fmt"
	"github.com/usmanager/microservices/death-star-bench/hotelReservation/services/geo"
	"log"
)

var ipAddress string
var port int
var mongoAddress string

func init() {
	flag.StringVar(&ipAddress, "ipAddress", "127.0.0.1", "The server ip address")
	flag.IntVar(&port, "port", 5000, "The server port")
	flag.StringVar(&mongoAddress, "mongoAddress", "127.0.0.1", "The mongodb address")
}

func main() {
	flag.Parse()

	mongoSession := initializeDatabase(mongoAddress)
	defer mongoSession.Close()

	fmt.Printf("geo ip = %s, port = %d, mongodb = %s\n", ipAddress, port, mongoAddress)

	srv := &geo.Server{
		IpAddr:       ipAddress,
		Port:         port,
		MongoSession: mongoSession,
	}

	log.Fatal(srv.Run())
}
