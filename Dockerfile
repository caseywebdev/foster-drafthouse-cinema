FROM node:9.4.0-alpine

RUN apk --no-cache add curl jq

WORKDIR /code

ARG TMDB_API_KEY
COPY bin/fetch-movies bin/
COPY etc/movies.json etc/
RUN \
  mkdir client && \
  bin/fetch-movies

FROM node:9.4.0-alpine

ENV CONTAINERPILOT_VERSION='3.6.2'
RUN \
  apk --no-cache add curl g++ jq libc6-compat make python && \
  curl -fLsS https://github.com/joyent/containerpilot/releases/download/$CONTAINERPILOT_VERSION/containerpilot-$CONTAINERPILOT_VERSION.tar.gz | \
    tar xz -C /usr/local/bin

WORKDIR /code

COPY package.json ./
RUN npm install --no-save

COPY client client
COPY --from=0 /code/client/movies.json client/movies.json
COPY etc/cogs.js etc/
COPY styles styles
RUN MINIFY=1 node_modules/.bin/cogs -c etc/cogs.js

COPY bin bin
COPY etc etc
COPY server server

ENV \
  CONSUL_SERVICE_NAME='foster-drafthouse-cinema' \
  CONSUL_SERVICE_TAGS='' \
  CONSUL_URL='' \
  CONTAINERPILOT='/code/etc/containerpilot.json5.gotmpl'

EXPOSE 80

CMD ["containerpilot"]
