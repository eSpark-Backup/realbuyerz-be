FROM node:lts-alpine

WORKDIR /usr/src/app

COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm install --silent --include=optional sharp && mv node_modules ../

COPY . .
RUN npx prisma generate
RUN npm run build

CMD ["npm", "run", "start:prod"]