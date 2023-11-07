FROM node:20.9.0

WORKDIR /app

COPY . .

RUN apt update && \
    apt upgrade -y && \
    apt install -y postgresql-client && \
    apt clean && \
    rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

RUN npm install -g pnpm && pnpm install

RUN chmod +x app.sh

ENTRYPOINT [ "/app/app.sh" ]
