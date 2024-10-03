FROM public.ecr.aws/docker/library/node:lts-alpine

RUN apk add tzdata && ln -snf /usr/share/zoneinfo/Asia/Seoul /etc/localtime

WORKDIR /app

COPY ./package.json ./
RUN yarn set version berry

RUN yarn install

COPY . .

RUN yarn build

CMD [ "yarn", "start:prod" ]

LABEL org.opencontainers.image.source=https://github.com/dimigo-din/dimigoin-back