FROM usmanager/registration-client AS registration-client

FROM maven:3.6.1-jdk-8-alpine AS build

WORKDIR /usr/src/registration-client

RUN wget https://github.com/usmanager/registration-client-java/archive/v1.0.tar.gz -O registration-client-java.tar.gz && \
tar -xf registration-client-java.tar.gz && \
cd registration-client-java-1.0 && \
mvn clean install -DskipTests -Dmaven.javadoc.skip=true

WORKDIR /usr/src/app

COPY src ./src
COPY pom.xml .
RUN mvn -DskipTests -f pom.xml clean package

FROM openjdk:8-jre-alpine

COPY --from=build /usr/src/app/target/shipping.jar shipping.jar
COPY --from=registration-client /app/registration-client .

COPY scripts/docker-init.sh docker-init.sh
RUN ["chmod", "+x", "docker-init.sh"]
ENTRYPOINT ["./docker-init.sh"]
# registration-server, externalPort, internalPort, hostname, rabbitmq, registration-client port
CMD ["127.0.0.1:8761", "8080", "80", "127.0.0.1", "rabbitmq", "1919"]
