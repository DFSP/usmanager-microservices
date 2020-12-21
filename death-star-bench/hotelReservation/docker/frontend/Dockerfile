FROM golang:1.14.6-alpine AS build
RUN apk add --no-cache git
# Build frontend binary
ARG path=/go/src/github.com/usmanager/microservices/hotelReservation
WORKDIR $path
COPY cmd/frontend cmd/frontend
COPY data data
COPY dialer dialer
COPY registry registry
COPY services services
COPY tracing tracing
COPY wrk2_lua_scripts wrk2_lua_scripts
COPY docker docker
COPY config.json go.mod Gopkg.toml ./
WORKDIR $path/cmd/frontend/
RUN go build -o frontend && \
mkdir /app && \
mv frontend /app/frontend && \
mv $path/docker/frontend/docker-init.sh /docker-init.sh
# Build final image
FROM usmanager/registration-client AS registration-client
FROM alpine:3.12.0
RUN mkdir /app
WORKDIR /app
COPY --from=build /app/frontend frontend
COPY --from=registration-client /app/registration-client .
COPY --from=build docker-init.sh docker-init.sh
RUN ["chmod", "+x", "docker-init.sh"]
ENTRYPOINT ["./docker-init.sh"]
# registration-server, external-port, internal-port, hostname, registration-client-port
CMD ["127.0.0.1:8761", "5000", "5000", "127.0.0.1", "1906"]