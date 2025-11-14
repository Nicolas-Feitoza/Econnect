#!/bin/bash

# Color codes
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}🌱 Econnect Development Setup${NC}\n"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${YELLOW}❌ Node.js is required. Please install Node.js 18+${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Node.js ${NC}$(node --version)"

# Install dependencies
echo -e "\n${BLUE}📦 Installing dependencies...${NC}"
npm install

if [ ! -f ".env.local" ]; then
    echo -e "\n${BLUE}📝 Creating .env.local from .env.example${NC}"
    cp .env.example .env.local
    echo -e "${YELLOW}⚠️  Update .env.local with your PostgreSQL credentials${NC}"
fi

# Check if PostgreSQL is accessible
echo -e "\n${BLUE}🗄️  Checking PostgreSQL connection...${NC}"
if command -v psql &> /dev/null; then
    # Try to connect
    if psql -h localhost -U econnect_user -d econnect_db -c "SELECT 1" > /dev/null 2>&1; then
        echo -e "${GREEN}✓ PostgreSQL is running${NC}"
    else
        echo -e "${YELLOW}⚠️  PostgreSQL not accessible. Starting Docker Compose...${NC}"
        docker-compose up -d
        sleep 5
    fi
else
    echo -e "${YELLOW}⚠️  PostgreSQL CLI not found. Make sure Docker Compose containers are running:${NC}"
    echo -e "${BLUE}   docker-compose up -d${NC}\n"
fi

# Run migrations
echo -e "\n${BLUE}🔄 Running database migrations...${NC}"
npm run db:migrate:dev --yes

# Seed database (only if first time)
read -p "Seed database with example data? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${BLUE}🌱 Seeding database...${NC}"
    npm run db:seed
fi

echo -e "\n${GREEN}✓ Setup complete!${NC}\n"
echo -e "${BLUE}📖 Next steps:${NC}"
echo -e "   1. ${YELLOW}Start development server${NC}: npm run dev"
echo -e "   2. ${YELLOW}Open browser${NC}: http://localhost:3000"
echo -e "   3. ${YELLOW}Login with${NC}:"
echo -e "      - Admin: admin@econnect.com / admin123456"
echo -e "      - Producer: produtor@example.com / producer123456"
echo -e "      - Company: empresa@example.com / company123456"
echo -e "\n${BLUE}📚 Documentation:${NC}"
echo -e "   - Quick Start: ${YELLOW}docs/QUICKSTART.md${NC}"
echo -e "   - Architecture: ${YELLOW}docs/ARCHITECTURE.md${NC}"
echo -e "   - API Docs: ${YELLOW}docs/API.md${NC}"
echo ""
