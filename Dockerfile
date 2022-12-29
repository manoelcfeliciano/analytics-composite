FROM node:14

WORKDIR /app

COPY package.json .

RUN yarn install

COPY . .

RUN yarn build

CMD ["yarn", "start"]
