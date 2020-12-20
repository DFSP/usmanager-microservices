package main

import (
	"flag"
	"fmt"
	"github.com/bradfitz/gomemcache/memcache"
	"github.com/usmanager/microservices/death-star-bench/hotelReservation/services/rate"
	"log"
	"time"
)

var ipAddress string
var port int
var mongoAddress string
var memcachedAddress string

func init() {
	flag.StringVar(&ipAddress, "ipAddress", "127.0.0.1", "The server ip address")
	flag.IntVar(&port, "port", 8084, "The server port")
	flag.StringVar(&mongoAddress, "mongoAddress", "127.0.0.1", "The mongodb address")
	flag.StringVar(&memcachedAddress, "memcachedAddress", "127.0.0.1", "The memcached address")
}

func main() {
	flag.Parse()

	mongoSession := initializeDatabase(mongoAddress)
	defer mongoSession.Close()

	memcClient := memcache.New(memcachedAddress)
	memcClient.Timeout = time.Second * 2
	memcClient.MaxIdleConns = 512

	fmt.Printf("rate ip = %s, port = %d, mongodb = %s, memcached = %s\n", ipAddress, port, mongoAddress, memcachedAddress)

	srv := &rate.Server{
		IpAddr:       ipAddress,
		Port:         port,
		MongoSession: mongoSession,
		MemcClient:   memcClient,
	}

	log.Fatal(srv.Run())
}
