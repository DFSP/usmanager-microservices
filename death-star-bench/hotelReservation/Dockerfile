FROM golang:1.9

COPY . /go/src/github.com/usmanager/microservices/death-star-bench/hotelReservation
WORKDIR /go/src/github.com/usmanager/microservices/death-star-bench/hotelReservation
RUN go get gopkg.in/mgo.v2
RUN go get github.com/bradfitz/gomemcache/memcache
RUN go install -ldflags="-s -w" ./cmd/...
