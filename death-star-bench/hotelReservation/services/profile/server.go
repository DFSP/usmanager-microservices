package profile

import (
	"encoding/json"
	"fmt"
	"github.com/usmanager/registration-client-go"
	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
	"os"
	"os/signal"
	"syscall"

	// "io/ioutil"
	"log"
	"net"
	// "os"
	"time"

	"github.com/opentracing/opentracing-go"
	"github.com/usmanager/microservices/death-star-bench/hotelReservation/registry"
	pb "github.com/usmanager/microservices/death-star-bench/hotelReservation/services/profile/proto"
	"golang.org/x/net/context"
	"google.golang.org/grpc"
	"google.golang.org/grpc/keepalive"

	"github.com/bradfitz/gomemcache/memcache"
	// "strings"
)

const name = "srv-profile"

// Server implements the profile service
type Server struct {
	Tracer       opentracing.Tracer
	Port         int
	IpAddr       string
	MongoSession *mgo.Session
	Registry     *registry.Client
	MemcClient   *memcache.Client
}

// Run starts the server
func (s *Server) Run() error {
	if s.Port == 0 {
		return fmt.Errorf("server port must be set")
	}

	// fmt.Printf("in run s.IpAddr = %s, port = %d\n", s.IpAddr, s.Port)

	srv := grpc.NewServer(
		grpc.KeepaliveParams(keepalive.ServerParameters{
			Timeout: 120 * time.Second,
		}),
		grpc.KeepaliveEnforcementPolicy(keepalive.EnforcementPolicy{
			PermitWithoutStream: true,
		}),
	)

	pb.RegisterProfileServer(srv, s)

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

// GetProfiles returns hotel profiles for requested IDs
func (s *Server) GetProfiles(ctx context.Context, req *pb.Request) (*pb.Result, error) {
	// session, err := mgo.Dial("mongodb-profile")
	// if err != nil {
	// 	panic(err)
	// }
	// defer session.Close()
	// fmt.Printf("In GetProfiles\n")

	// fmt.Printf("In GetProfiles after setting c\n")

	res := new(pb.Result)
	hotels := make([]*pb.Hotel, 0)

	// one hotel should only have one profile

	for _, i := range req.HotelIds {
		// first check memcached
		item, err := s.MemcClient.Get(i)
		if err == nil {
			// memcached hit
			// profile_str := string(item.Value)

			// fmt.Printf("memc hit\n")
			// fmt.Println(profile_str)

			hotel_prof := new(pb.Hotel)
			json.Unmarshal(item.Value, hotel_prof)
			hotels = append(hotels, hotel_prof)

		} else if err == memcache.ErrCacheMiss {
			// memcached miss, set up mongo connection
			session := s.MongoSession.Copy()
			defer session.Close()
			c := session.DB("profile-db").C("hotels")

			hotel_prof := new(pb.Hotel)
			err := c.Find(bson.M{"id": i}).One(&hotel_prof)

			if err != nil {
				log.Println("Failed get hotels data: ", err)
			}

			// for _, h := range hotels {
			// 	res.Hotels = append(res.Hotels, h)
			// }
			hotels = append(hotels, hotel_prof)

			prof_json, err := json.Marshal(hotel_prof)
			memc_str := string(prof_json)

			// write to memcached
			s.MemcClient.Set(&memcache.Item{Key: i, Value: []byte(memc_str)})

		} else {
			fmt.Printf("Memmcached error = %s\n", err)
			panic(err)
		}
	}

	res.Hotels = hotels
	// fmt.Printf("In GetProfiles after getting resp\n")
	return res, nil
}
