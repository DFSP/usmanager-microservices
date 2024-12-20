package main

import (
	"flag"
	"fmt"
	"github.com/usmanager/microservices/death-star-bench/hotelReservation/services/user"
	"log"
)

var ipAddress string
var port int
var mongoAddress string

func init() {
	flag.StringVar(&ipAddress, "ipAddress", "127.0.0.1", "The server ip address")
	flag.IntVar(&port, "port", 8086, "The server port")
	flag.StringVar(&mongoAddress, "mongoAddress", "127.0.0.1", "The mongodb address")
}

func main() {
	flag.Parse()

	mongoSession := initializeDatabase(mongoAddress)
	defer mongoSession.Close()

	fmt.Printf("rate ip = %s, port = %d, mongodb = %s\n", ipAddress, port, mongoAddress)

	srv := &user.Server{
		IpAddr:       ipAddress,
		Port:         port,
		MongoSession: mongoSession,
	}

	log.Fatal(srv.Run())
}
