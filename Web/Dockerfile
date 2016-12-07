FROM node:argon

# Create app directory
RUN mkdir -p /app
WORKDIR /app

# Install app dependencies
COPY package.json /app
RUN npm install

# Bundle app source
COPY . /app

ENV NODE_ENV development # production for staging
EXPOSE 8080
CMD [ "npm", "start" ]