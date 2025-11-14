
FROM node:20

# Use Debian-based image so Prisma query engine dependencies (OpenSSL, libc)
# are available and compatible. This avoids musl/OpenSSL issues on Alpine.

WORKDIR /app

# Instalar dependências
COPY package*.json ./
RUN npm ci

# Copiar código e schema
COPY . .

# Gerar Prisma Client
RUN npx prisma generate

# Build Next.js
RUN npm run build

# Expor porta
EXPOSE 3000

# Start
CMD ["npm", "start"]
