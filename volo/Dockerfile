FROM node:20.9.0 as builder

WORKDIR /app

COPY . .

RUN apt update && apt install -y psql

RUN cd volo && npm install -g pnpm && pnpm install

RUN pnpm db:push

RUN pnpm script ./scripts/init.ts

RUN pnpm build


FROM node:20.9.0

WORKDIR /app

COPY --from=builder /app/build /app/build

EXPOSE 3000

CMD [ "npm", "start" ]
