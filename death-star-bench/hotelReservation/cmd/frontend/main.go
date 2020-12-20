package main

import (
	"flag"
	"fmt"
	"github.com/usmanager/microservices/death-star-bench/hotelReservation/services/frontend"
	"github.com/usmanager/registration-client-go"
	"golang.org/x/net/context"
	"log"
	"time"
)

var port int
var ipAddress string

func init() {
	flag.IntVar(&port, "port", 5000, "The server port")
	flag.StringVar(&ipAddress, "ipAddress", "127.0.0.1", "The server address")
}

func main() {
	flag.Parse()

	apiClient := registration.NewAPIClient(registration.NewConfiguration())
	ctx := context.Background()
	for index := 0; index < 5; index++ {
		_, err := apiClient.EndpointsApi.RegisterEndpoint(ctx)
		if err == nil {
			break
		}
		if index >= 4 {
			log.Fatal("Failed to register app: ", err, ". Giving up")
		} else {
			log.Print("Failed to register app. Error: ", err)
			time.Sleep(5 * time.Second)
		}
	}

	fmt.Printf("frontend ip = %s, port = %d\n", ipAddress, port)

	srv := &frontend.Server{
		IpAddr: ipAddress,
		Port:   port,
	}

	log.Fatal(srv.Run())
}
