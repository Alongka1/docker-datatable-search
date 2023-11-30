FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci

RUN npm i react-data-table-component axios

COPY . .

RUN npm run build

CMD [ "npx", "serve", "dist" ]