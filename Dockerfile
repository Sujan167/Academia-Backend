FROM node:16-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production && npm cache clean --force

COPY . .

RUN npm install prisma
RUN npx prisma generate

# RUN npm install --save dotenv-extended 

EXPOSE 3001

CMD ["npm", "run", "start"]
