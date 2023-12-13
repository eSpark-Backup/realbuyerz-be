FROM node:18-alpine

# Set environment variables
ENV NODE_ENV production
ENV DATABASE_URL="postgresql://postgres:admin@127.0.0.1:5432/RealBuyerz"
ENV TOKEN_KEY="BADAMI"
ENV OTP_KEY="OTP-KEY"
ENV TOKEN_EXPIRY="1d"
ENV TWILIO_ACCOUNT_SID="AC4d0051d9f25af843b4f7fdfc9a18e6e6"
ENV TWILIO_AUTH_TOKEN="fe8365b20b880d82b5989caa72b0debf"
ENV TWILIO_PHONE_NUMBER="+16063571913"
ENV SENDGRID_API_KEY="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"
ENV FRONTEND_URL="www.realbuyerz.com"

WORKDIR /ahmed/src/app

COPY package*.json ./

RUN npm install 

# Add the binaryTargets fix for Prisma Client
RUN npx prisma generate

COPY . .

RUN npm run build

EXPOSE 3000

CMD [ "node" , "dist/src/main" ]