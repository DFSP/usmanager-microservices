package search

import (
	"github.com/usmanager/microservices/death-star-bench/hotelReservation/dialer"
	"os"
	"os/signal"
	"syscall"

	// "encoding/json"
	"fmt"
	"github.com/usmanager/registration-client-go"

	// F"io/ioutil"
	"log"
	"net"
	// "os"
	"time"

	opentracing "github.com/opentracing/opentracing-go"
	"github.com/usmanager/microservices/death-star-bench/hotelReservation/registry"
	geo "github.com/usmanager/microservices/death-star-bench/hotelReservation/services/geo/proto"
	rate "github.com/usmanager/microservices/death-star-bench/hotelReservation/services/rate/proto"
	pb "github.com/usmanager/microservices/death-star-bench/hotelReservation/services/search/proto"
	context "golang.org/x/net/context"
	"google.golang.org/grpc"
	"google.golang.org/grpc/keepalive"
)

const name = "srv-search"

// Server implments the search service
type Server struct {
	geoClient  geo.GeoClient
	rateClient rate.RateClient

	Tracer   opentracing.Tracer
	Port     int
	IpAddr   string
	Registry *registry.Client
}

// Run starts the server
func (s *Server) Run() error {
	if s.Port == 0 {
		return fmt.Errorf("server port must be set")
	}

	srv := grpc.NewServer(
		grpc.KeepaliveParams(keepalive.ServerParameters{
			Timeout: 120 * time.Second,
		}),
		grpc.KeepaliveEnforcementPolicy(keepalive.EnforcementPolicy{
			PermitWithoutStream: true,
		}),
	)
	pb.RegisterSearchServer(srv, s)

	lis, err := net.Listen("tcp", fmt.Sprintf(":%d", s.Port))
	if err != nil {
		return fmt.Errorf("failed to listen: %v", err)
	}

	errc := make(chan error)

	// Create and launch the HTTP server.
	go func() {
		errc <- srv.Serve(lis)
	}()

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

	// Capture interrupts.
	go func() {
		c := make(chan os.Signal)
		signal.Notify(c, syscall.SIGINT, syscall.SIGTERM)
		errc <- fmt.Errorf("%s", <-c)
	}()

	return <-errc
}

// Shutdown cleans up any processes
func (s *Server) Shutdown() {
	/*s.Registry.Deregister(name)*/
}

func getEndpoint(srv string) (*registration.Endpoint, error) {
	service := "hotel-reservation-" + srv
	log.Printf("Requesting endpoint for service %s\n", service)
	ctx := context.Background()
	apiClient := registration.NewAPIClient(registration.NewConfiguration())
	endpoint, _, err := apiClient.EndpointsApi.GetServiceEndpoint(ctx, service)
	if err != nil {
		return nil, err
	}
	log.Printf("Got response: %+v\n", &endpoint)
	return &endpoint, nil
}

func (s *Server) getRateClient() error {
	service := "rate"
	endpoint, err := getEndpoint(service)
	if err != nil {
		return fmt.Errorf("get %s endpoint error: %v", service, err)
	}
	conn, err := dialer.Dial(endpoint.Endpoint)
	if err != nil {
		return fmt.Errorf("dialer error: %v", err)
	}
	s.rateClient = rate.NewRateClient(conn)
	return nil
}

func (s *Server) getGeoClient() error {
	service := "geo"
	endpoint, err := getEndpoint(service)
	if err != nil {
		return fmt.Errorf("get %s endpoint error: %v", service, err)
	}
	conn, err := dialer.Dial(endpoint.Endpoint)
	if err != nil {
		return fmt.Errorf("dialer error: %v", err)
	}
	s.geoClient = geo.NewGeoClient(conn)
	return nil
}

// Nearby returns ids of nearby hotels ordered by ranking algo
func (s *Server) Nearby(ctx context.Context, req *pb.NearbyRequest) (*pb.SearchResult, error) {
	// find nearby hotels
	// fmt.Printf("in Search Nearby\n")

	// fmt.Printf("nearby lat = %f\n", req.Lat)
	// fmt.Printf("nearby lon = %f\n", req.Lon)
	err := s.getGeoClient()
	if err != nil {
		log.Fatalf("get geo client error: %v", err)
	}
	nearby, err := s.geoClient.Nearby(ctx, &geo.Request{
		Lat: req.Lat,
		Lon: req.Lon,
	})
	if err != nil {
		log.Fatalf("nearby error: %v", err)
	}

	// for _, hid := range nearby.HotelIds {
	// 	fmt.Printf("get Nearby hotelId = %s\n", hid)
	// }

	// find rates for hotels
	err = s.getRateClient()
	if err != nil {
		log.Fatalf("get rate client error: %v", err)
	}
	rates, err := s.rateClient.GetRates(ctx, &rate.Request{
		HotelIds: nearby.HotelIds,
		InDate:   req.InDate,
		OutDate:  req.OutDate,
	})
	if err != nil {
		log.Fatalf("rates error: %v", err)
	}

	// TODO(hw): add simple ranking algo to order hotel ids:
	// * geo distance
	// * price (best discount?)
	// * reviews

	// build the response
	res := new(pb.SearchResult)
	for _, ratePlan := range rates.RatePlans {
		// fmt.Printf("get RatePlan HotelId = %s, Code = %s\n", ratePlan.HotelId, ratePlan.Code)
		res.HotelIds = append(res.HotelIds, ratePlan.HotelId)
	}
	return res, nil
}
