FROM usmanager/registration-client AS registration-client

FROM rabbitmq:alpine

COPY --from=registration-client /app/registration-client ./registration-client
COPY scripts/docker-init.sh ./docker-init.sh

RUN ["chmod", "+x", "docker-init.sh"]

ENTRYPOINT ["./docker-init.sh"]
ENV LATITUDE 0
ENV LONGITUDE 0

# rabbitmq ports: 4369 5671 5672 25672
# registration-server, external-port, internal-port, hostname, registration-client-port, latitude, longitude
CMD 127.0.0.1:8761 5672 5672 127.0.0.1 1906 $LATITUDE $LONGITUDE