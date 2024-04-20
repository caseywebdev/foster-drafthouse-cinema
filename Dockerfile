FROM node:19.2.0-alpine

WORKDIR /code

CMD ["bin/run"]

ENV \
  FORCE_COLOR='1' \
  WATCH='0'

COPY package.json ./
RUN \
  npm install && \
  npm cache clean --force

COPY bin bin
COPY api api
COPY cogs.js ./
COPY app app

RUN \
  MINIFY=1 bin/build
