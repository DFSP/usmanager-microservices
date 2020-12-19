FROM golang:1.14.6-alpine AS build

RUN apk add --no-cache git

# Build geo binary
COPY cmd/geo /go/src/github.com/usmanager/microservices/hotelReservation/cmd/geo
COPY data /go/src/github.com/usmanager/microservices/hotelReservation/data
COPY dialer /go/src/github.com/usmanager/microservices/hotelReservation/dialer
COPY registry /go/src/github.com/usmanager/microservices/hotelReservation/registry
COPY services /go/src/github.com/usmanager/microservices/hotelReservation/services
COPY tracing /go/src/github.com/usmanager/microservices/hotelReservation/tracing
COPY wrk2_lua_scripts /go/src/github.com/usmanager/microservices/hotelReservation/wrk2_lua_scripts
COPY config.json go.mod Gopkg.toml /go/src/github.com/usmanager/microservices/hotelReservation/
WORKDIR /go/src/github.com/usmanager/microservices/hotelReservation/cmd/geo/
RUN go build -o geo && \
mkdir /app && \
mv /go/src/github.com/usmanager/microservices/hotelReservation/cmd/geo/geo /app/geo

# Build final image
FROM usmanager/registration-client AS registration-client
FROM alpine:3.12.0

RUN apk add --no-cache git && \
mkdir /app

WORKDIR /app

COPY --from=build /app/geo geo
COPY --from=registration-client /app/registration-client .
COPY --from=build /go/src/github.com/usmanager/microservices/hotelReservation/docker/geo/docker-init.sh docker-init.sh

RUN ["chmod", "+x", "docker-init.sh"]
ENTRYPOINT ["./docker-init.sh"]
# registration-server, externalPort, internalPort, hostname, registration-client-port, db
CMD ["127.0.0.1:8761", "5000", "5000", "127.0.0.1", "1906", "geo-db:27017"]