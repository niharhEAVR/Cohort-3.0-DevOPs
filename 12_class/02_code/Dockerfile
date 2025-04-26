FROM oven/bun:alpine

WORKDIR /app

COPY ./package.json ./package.json
COPY ./bun.lock ./bun.lock

RUN bun install

COPY . .

EXPOSE 3000

CMD ["bun","index.ts"]
