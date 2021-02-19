FROM golang:1.14.6-alpine AS build
RUN apk add --no-cache git
# Build reservation binary
ARG path=/go/src/github.com/usmanager/microservices/hotelReservation
WORKDIR $path
COPY cmd/reservation cmd/reservation
COPY data data
COPY dialer dialer
COPY registry registry
COPY services services
COPY tracing tracing
COPY wrk2_lua_scripts wrk2_lua_scripts
COPY docker docker
COPY config.json go.mod Gopkg.toml ./
WORKDIR $path/cmd/reservation/
RUN go build -o reservation && \
mkdir /app && \
mv reservation /app/reservation && \
mv $path/docker/reservation/docker-init.sh /docker-init.sh
# Build final image
FROM usmanager/registration-client AS registration-client
FROM alpine:3.12.0
RUN apk add --no-cache git && \
mkdir /app
WORKDIR /app
COPY --from=build /app/reservation reservation
COPY --from=registration-client /app/registration-client .
COPY --from=build docker-init.sh docker-init.sh
RUN ["chmod", "+x", "docker-init.sh"]
ENTRYPOINT ["./docker-init.sh"]
ENV LATITUDE 0
ENV LONGITUDE 0
# registration-server, external-port, internal-port, hostname, registration-client-port, latitude, longitude, db, memcached
CMD 127.0.0.1:8761 5000 5000 127.0.0.1 1906 $LATITUDE $LONGITUDE reservation-db:27017 reservation-memcached:11214