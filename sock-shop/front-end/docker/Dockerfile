FROM usmanager/registration-client AS registration-client
FROM node:alpine3.12 AS base

WORKDIR /app

FROM base AS development
COPY package.json yarn.lock ./
RUN yarn install --pure-lockfile --production
RUN cp -R node_modules /tmp/node_modules

# install all dependencies and add source code
RUN yarn install --pure-lockfile
COPY . .

FROM development as builder
RUN yarn babel src --out-dir ./dist --copy-files
RUN ls dist
# release includes bare minimum required to run the app, copied from builder
FROM base AS release
COPY --from=builder /tmp/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./
COPY --from=registration-client /app/registration-client .
COPY scripts/docker-init.sh docker-init.sh

ENV NODE_ENV "production"
ENV PORT 8079
EXPOSE 8079

RUN ["chmod", "+x", "docker-init.sh"]
ENTRYPOINT ["./docker-init.sh"]
# registration-server, externalPort, internalPort, hostname
CMD ["127.0.0.1:8761", "8079", "80", "127.0.0.1"]