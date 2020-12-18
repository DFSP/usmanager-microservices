package dialer

import (
	"fmt"
	"time"

	"google.golang.org/grpc"
	"google.golang.org/grpc/keepalive"
)

// DialOption allows optional config for dialer
type DialOption func(name string) (grpc.DialOption, error)

/*// WithTracer traces rpc calls
func WithTracer(tracer opentracing.Tracer) DialOption {
	return func(name string) (grpc.DialOption, error) {
		return grpc.WithUnaryInterceptor(otgrpc.OpenTracingClientInterceptor(tracer)), nil
	}
}*/

/*// WithBalancer enables client side load balancing
func WithBalancer(registry *consul.Client) DialOption {
	return func(name string) (grpc.DialOption, error) {
		r, err := lb.NewResolver(registry, name, "")
		if err != nil {
			return nil, err
		}
		return grpc.WithBalancer(grpc.RoundRobin(r)), nil
	}
}*/

func Dial(endpoint string) (*grpc.ClientConn, error) {
	dialopts := []grpc.DialOption{
		grpc.WithInsecure(),
		grpc.WithKeepaliveParams(keepalive.ClientParameters{
			Timeout:             120 * time.Second,
			PermitWithoutStream: true,
		}),
	}

	conn, err := grpc.Dial(endpoint, dialopts...)
	if err != nil {
		return nil, fmt.Errorf("failed to dial %s: %v", endpoint, err)
	}

	return conn, nil
}
