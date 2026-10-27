FROM node:22-alpine
WORKDIR /app

# 1. Инсталиране на зависимостите за Node.js
COPY package*.json ./
RUN npm install

# 2. Копиране на package.json за React
COPY client/package*.json ./client/
RUN cd client && npm install

# ========================================================
# ВАЖНО: Добавяме променливата за вашия домейн, за да може 
# скриптът ви да я запише във фронтенда преди npm run build
# (След време в Clouding.io тук ще напишете вашия истински домейн)
# ========================================================
ARG API_BASE_URL
ENV API_BASE_URL=$API_BASE_URL
ENV NODE_ENV=production

# 3. Копираме целия код (за да може скриптът да види файловете)
COPY . .

# 4. Стартираме междинен скрипт, който да генерира .env файла, и сглобяваме React
RUN node -e "const fs = require('fs'); const path = require('path'); const frontendEnvPath = path.join(__dirname, './client/.env'); fs.writeFileSync(frontendEnvPath, 'VITE_API_BASE_URL=' + process.env.API_BASE_URL + '\n');"
RUN cd client && npm run build

EXPOSE 5000
CMD ["npm", "start"]