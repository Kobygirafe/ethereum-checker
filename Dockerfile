FROM node:17-alpine as BASE
# update packages
RUN apk update
WORKDIR /app
COPY package*.json ./
COPY tsconfig.json ./
COPY src /app/src

RUN ls -a
RUN npm install
RUN npm run build

EXPOSE 8080

CMD [ "node", "./dist/index.js" ]