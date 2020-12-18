package main

import (
	"flag"
	"github.com/usmanager/microservices/death-star-bench/hotelReservation/services/frontend"
	"github.com/usmanager/registration-client-go"
	"golang.org/x/net/context"
	"log"
	"time"
)

var port int

func init() {
	flag.IntVar(&port, "port", 5000, "The server port")
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

	srv := &frontend.Server{
		Port:     port,
	}

	log.Fatal(srv.Run())
}
