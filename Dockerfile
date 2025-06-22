FROM node:18.18.2-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Add this line:
COPY .env .env

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
