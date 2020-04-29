FROM node:10

WORKDIR ./fun/wolf
# change this according to your file location

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8080
CMD [ "npm", "run", "start" ]
