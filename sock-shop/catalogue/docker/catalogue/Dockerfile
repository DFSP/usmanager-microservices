FROM golang:1.14.6-alpine AS build

# Build catalogue binary
COPY . /go/src/github.com/usmanager/manager/microservices/sock-shop/catalogue
WORKDIR /go/src/github.com/usmanager/manager/microservices/sock-shop/catalogue/cmd
RUN go build -o catalogue && \
mkdir /app && \
mv /go/src/github.com/usmanager/manager/microservices/sock-shop/catalogue/cmd/catalogue /app/catalogue

# Build final image
FROM usmanager/registration-client AS registration-client
FROM alpine:3.12.0
RUN mkdir /app
WORKDIR /app
COPY --from=build /app/catalogue catalogue
COPY --from=registration-client /app/registration-client .
COPY images images
COPY scripts/docker-init.sh docker-init.sh
RUN ["chmod", "+x", "docker-init.sh"]
ENTRYPOINT ["./docker-init.sh"]
# registration-server, externalPort, internalPort, hostname, db
CMD ["127.0.0.1:8761", "8080", "80", "127.0.0.1", "catalogue-db:3306"]