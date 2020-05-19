# 🐺Wolf Project

## Project Structure

`server/`: backend code

`app/`: front end code

## Local Development

### clone the repo

SSH:

```bash
git clone git@github.com:thomas81528262/wolf.git
```

### prerequest installed

1. nodejs (10.x and higher)
2. postgresql db (docker or local)

### run local db by docker-compose

```bash
# make sure the db/data is exist, the db data will save in the folder
$ mkdir db/data
#turn on the db and run under background
$ docker-compose up -d
#turn off the db
$ docker-compose down
```

### read doc

follow the README.md instruction under the `/app` and `/server`

## Installation and building

### install node

#### Mac

`$ brew install node` or visit [here](https://nodejs.org/en/download/) to download the installer

#### Windows

Go [here](https://nodejs.org/en/download/) to download the installer

### Using docker

#### install docker

Go [here](https://docs.docker.com/engine/install/) to select the installer according to your OS platform

#### Modify Dockerfile

change the directory location accordingly

#### Docker Basic Command

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


