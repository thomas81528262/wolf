

# Wolf Project

## Project structure

`server/`: backend code

`app/`: front end code

## Installation and building

### clone the repo

SSH: `$ git clone git@github.com:thomas81528262/wolf.git`

HTTPS: `$ git clone https://github.com/thomas81528262/wolf.git`

### From terminal

#### install node

##### Mac

`$ brew install node` or visit [here](https://nodejs.org/en/download/) to download the installer

##### Windows

Go [here](https://nodejs.org/en/download/) to download the installer

#### run the app

in repo

`$ npm run start`

### Using docker

#### install docker

Go [here](https://docs.docker.com/engine/install/) to select the installer according to your OS platform

#### Modify Dockerfile

change the directory location accordingly

#### Image building and running

```bash
$ docker build -t {app_name} .

$ docker image

# you should see built image(s) here

$ docker ps

# you can see the container ID (optional)

$ docker logs {your_container_ID}

# get some output from the server (optional)

$ docker run -p {export_port}:8080 -d {app_name}

# run the image
# to test the app open localhost:{port#}
# e.g. localhost:5566

```

#### mount local folder

```bash
$ docker run  -p 4000:4000 -v {src_path_in_your_host}:{path_inside_the_docker_image}  -it node:10 /bin/sh

# the container will mount the local folder from your host
```

## Local Development

### run local db

```bash
#turn on the db
$ docker-compose up -d
#turn off the db
$ docker-compose down

```
