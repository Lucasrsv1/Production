FROM node:7.7.2-alpine
RUN mkdir -p /usr/app
WORKDIR /usr/app
COPY ./ /usr/app/
