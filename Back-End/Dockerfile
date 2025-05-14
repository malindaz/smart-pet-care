#use base image from Docker Hub
FROM node:20-alpine

#set working directory
WORKDIR /app

#copy package.json files
COPY package*json ./

#install dependencies
RUN npm install

#copy the rest of the application files
COPY . .

#expose the application running port
EXPOSE 5000

#start the application
CMD [ "npm" , "start" ] 