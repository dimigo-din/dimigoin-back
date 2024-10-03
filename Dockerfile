FROM public.ecr.aws/docker/library/node:18-alpine
WORKDIR /app

RUN apk add tzdata && ln -snf /usr/share/zoneinfo/Asia/Seoul /etc/localtime

COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn ./.yarn

RUN yarn install

COPY . .

RUN yarn build

CMD [ "yarn", "start:prod" ]

LABEL org.opencontainers.image.source=https://github.com/dimigo-din/dimigoin-back