FROM alpine:3.3

# Prepare env
RUN apk add --update nodejs
RUN mkdir -p /usr/src/inmemtrad
WORKDIR /usr/src/inmemtrad
ENV IMTCONNECT=DOCKER

# Install app
COPY package.json /usr/src/inmemtrad
COPY . /usr/src/inmemtrad

RUN npm install

CMD ["npm", "start"]
