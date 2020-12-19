FROM golang:1.14.6-alpine AS build

RUN apk add --no-cache git

# Build rate binary
COPY cmd/rate /go/src/github.com/usmanager/microservices/hotelReservation/cmd/rate
COPY data /go/src/github.com/usmanager/microservices/hotelReservation/data
COPY dialer /go/src/github.com/usmanager/microservices/hotelReservation/dialer
COPY registry /go/src/github.com/usmanager/microservices/hotelReservation/registry
COPY services /go/src/github.com/usmanager/microservices/hotelReservation/services
COPY tracing /go/src/github.com/usmanager/microservices/hotelReservation/tracing
COPY wrk2_lua_scripts /go/src/github.com/usmanager/microservices/hotelReservation/wrk2_lua_scripts
COPY docker /go/src/github.com/usmanager/microservices/hotelReservation/docker
COPY config.json go.mod Gopkg.toml /go/src/github.com/usmanager/microservices/hotelReservation/
WORKDIR /go/src/github.com/usmanager/microservices/hotelReservation/cmd/rate/
RUN go build -o rate && \
mkdir /app && \
mv /go/src/github.com/usmanager/microservices/hotelReservation/cmd/rate/rate /app/rate

# Build final image
FROM usmanager/registration-client AS registration-client
FROM alpine:3.12.0

RUN apk add --no-cache git && \
mkdir /app

WORKDIR /app

COPY --from=build /app/rate rate
COPY --from=registration-client /app/registration-client .
COPY --from=build /go/src/github.com/usmanager/microservices/hotelReservation/docker/rate/docker-init.sh docker-init.sh

RUN ["chmod", "+x", "docker-init.sh"]
ENTRYPOINT ["./docker-init.sh"]
# registration-server, externalPort, internalPort, hostname, registration-client-port, db
CMD ["127.0.0.1:8761", "5000", "5000", "127.0.0.1", "1906", "rate-db:27017"]