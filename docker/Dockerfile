FROM node:20-alpine

WORKDIR /app

# Instalar dependencies
COPY package*.json ./

RUN npm ci
RUN npx prisma generate



# Copiar código
COPY prisma ./prisma
COPY . .

# Gerar Prisma Client
RUN npx prisma generate

# Build Next.js
RUN npm run build

# Expor porta
EXPOSE 3000

# Start
CMD ["npm", "start"]
