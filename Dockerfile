FROM node:4.2
MAINTAINER Mikael Korpela <mikael@ihminen.org>

# Install Dump-init
# https://github.com/Yelp/dumb-init
RUN wget https://github.com/Yelp/dumb-init/releases/download/v1.0.0/dumb-init_1.0.0_amd64.deb
RUN dpkg -i dumb-init_*.deb

RUN mkdir -p /srv/app

# Install node modules
ADD package.json /tmp/package.json
RUN cd /tmp && npm install
RUN cp -a /tmp/node_modules /srv/app

# Set environment variables
ENV NODE_ENV development
ENV DB_1_PORT_27017_TCP_ADDR mongodb
ENV PORT 3000
ENV DOMAIN app.dev

# Load application's code in, therefore the previous docker
# "layer" thats been cached will be used if possible
WORKDIR /srv/app
ADD . /srv/app

# Port 80 for Nginx proxy
# Port 5858 for Node debug
# Port 3000 for Nodemon server
# Port 35729 for LiveReload
EXPOSE 80
EXPOSE 3000
EXPOSE 5858
EXPOSE 35729
CMD ["dumb-init", "npm", "start"]
