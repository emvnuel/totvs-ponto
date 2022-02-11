FROM node:16.13.2-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
ENTRYPOINT [ "node", "src/main.js" ]