FROM node:22-alpine

WORKDIR /app

COPY ./package.json ./package.json
COPY ./package-lock.json ./package-lock.json

RUN npm install

COPY . .
RUN npm run dev

EXPOSE 3001

CMD ["node","dist/index.js"]