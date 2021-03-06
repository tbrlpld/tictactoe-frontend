FROM node:13.10

RUN apt-get update -y && apt-get upgrade -y
RUN apt-get install -y aptitude
RUN aptitude update -y && aptitude upgrade -y
RUN aptitude install -y -q sudo
RUN aptitude install -y -q httpie
RUN aptitude install -y -q fail2ban
RUN aptitude install -y -q nano
# serve will be used as the webserver to host the react site as suggested by the create-react-app documentation: https://create-react-app.dev/docs/deployment
RUN npm install -g serve

# Create a new user. This is the user with which the container is started by default.
# This user should be used for all application setup etc.
# If you need root access, you can start the container with -U root.
# Or for following installations/admin actions switch back to root before and back after.
RUN useradd -m -s /bin/bash docker

# Create app directory
RUN mkdir /app
RUN chown docker:docker /app
WORKDIR /app

# Switch to none root account
USER docker

# Copy dependencies list and install
COPY package.json /app
RUN npm install

# Copy app
COPY . /app 
# Build app
RUN npm run build
# Serve the app
ENTRYPOINT serve -s build -l 3000
EXPOSE 3000