FROM golang:1.14.6-alpine AS build

RUN apk add --no-cache git

# Build profile binary
COPY cmd/profile /go/src/github.com/usmanager/microservices/hotelReservation/cmd/profile
COPY data /go/src/github.com/usmanager/microservices/hotelReservation/data
COPY dialer /go/src/github.com/usmanager/microservices/hotelReservation/dialer
COPY registry /go/src/github.com/usmanager/microservices/hotelReservation/registry
COPY services /go/src/github.com/usmanager/microservices/hotelReservation/services
COPY tracing /go/src/github.com/usmanager/microservices/hotelReservation/tracing
COPY wrk2_lua_scripts /go/src/github.com/usmanager/microservices/hotelReservation/wrk2_lua_scripts
COPY config.json go.mod Gopkg.toml /go/src/github.com/usmanager/microservices/hotelReservation/
WORKDIR /go/src/github.com/usmanager/microservices/hotelReservation/cmd/profile/
RUN go build -o profile && \
mkdir /app && \
mv /go/src/github.com/usmanager/microservices/hotelReservation/cmd/profile/profile /app/profile

# Build final image
FROM usmanager/registration-client AS registration-client
FROM alpine:3.12.0

RUN apk add --no-cache git && \
mkdir /app

WORKDIR /app

COPY --from=build /app/profile profile
COPY --from=registration-client /app/registration-client .
COPY --from=build /go/src/github.com/usmanager/microservices/hotelReservation/docker/profile/docker-init.sh docker-init.sh

RUN ["chmod", "+x", "docker-init.sh"]
ENTRYPOINT ["./docker-init.sh"]
# registration-server, externalPort, internalPort, hostname, registration-client-port, db
CMD ["127.0.0.1:8761", "5000", "5000", "127.0.0.1", "1906", "profile-db:27017"]