#use base image from Docker Hub
FROM node:20-alpine

#set working directo
WORKDIR /app

#copy package.json files
COPY package*.json ./

#install dependencies
RUN npm install

#copy the rest of the application files
COPY . .

#expose the application running port
EXPOSE 3000

#start the application
CMD [ "npm" , "start" ]