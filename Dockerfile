FROM node:7.7.2-alpine
RUN npm install duration-js
RUN mkdir -p /usr/app
WORKDIR /usr/app
COPY ./ /usr/app/