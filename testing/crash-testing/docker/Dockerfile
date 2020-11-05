FROM alpine
COPY /scripts/docker-init.sh /
RUN ["chmod", "+x", "docker-init.sh"]
ENTRYPOINT ["/docker-init.sh"]