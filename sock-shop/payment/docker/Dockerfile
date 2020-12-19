FROM golang:1.14.6-alpine AS build

# Build payment binary
COPY . /go/src/github.com/usmanager/microservices/sock-shop/payment
WORKDIR /go/src/github.com/usmanager/microservices/sock-shop/payment

RUN apk add --no-cache git && \
go get -u github.com/FiloSottile/gvt && \
gvt restore

WORKDIR /go/src/github.com/usmanager/microservices/sock-shop/payment/cmd

RUN go build -o payment && \
mkdir /app && \
mv /go/src/github.com/usmanager/microservices/sock-shop/payment/cmd/payment /app/payment

# Build final image
FROM usmanager/registration-client AS registration-client
FROM alpine:3.12.0
RUN mkdir /app
WORKDIR /app
COPY --from=build /app/payment payment
COPY --from=registration-client /app/registration-client .
COPY scripts/docker-init.sh docker-init.sh
RUN ["chmod", "+x", "docker-init.sh"]
ENTRYPOINT ["./docker-init.sh"]
# registration-server, externalPort, internalPort, hostname, registration-client-port
CMD ["127.0.0.1:8761", "8080", "80", "127.0.0.1", "1906"]