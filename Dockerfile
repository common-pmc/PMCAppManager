FROM node:22-alpine
WORKDIR /app

# Инсталираме зависимости САМО за бекенда
COPY package*.json ./
RUN npm install

# Копираме целия код (включително вече готовата папка client/dist)
COPY . .

EXPOSE 5000
CMD ["npm", "start"]
