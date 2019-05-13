FROM node:10

RUN mkdir -p /usr/src/app

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

# If you are building your code for production
# RUN npm install --production
RUN npm install --production

# Bundle app source
COPY . .

EXPOSE 7000

ENV PORT 7000

ENV NODE_ENV production

CMD [ "npm", "start" ]