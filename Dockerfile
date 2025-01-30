FROM node:lts-alpine

WORKDIR /usr/src/app
RUN apk add --no-cache openssl

COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "prisma", "./"]
RUN npm cache clean --force
RUN npm install --silent --include=optional sharp && mv node_modules ../

COPY . .
RUN npx prisma generate
RUN npm run build

CMD ["npm", "run", "start:prod"]