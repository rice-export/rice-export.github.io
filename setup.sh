#!/bin/bash

# Oriza Platform Setup Script
# This script automates the setup of the full Oriza platform

set -e

echo "=========================================="
echo "🚀 Oriza Platform Setup"
echo "=========================================="
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v16 or higher."
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Check MongoDB
if ! command -v mongod &> /dev/null; then
    echo "⚠️  MongoDB is not installed. Installing MongoDB..."
    # MongoDB installation instructions for different OS
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        sudo apt-get update
        sudo apt-get install -y mongodb
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        brew tap mongodb/brew
        brew install mongodb-community
    fi
fi

echo "✅ MongoDB found"
echo ""

# Backend Setup
echo "=========================================="
echo "📦 Setting Up Backend"
echo "=========================================="
cd backend

if [ ! -f .env ]; then
    echo "📝 Creating .env file from .env.example..."
    cp .env.example .env
    echo "⚠️  Please update backend/.env with your configuration"
fi

echo "📥 Installing backend dependencies..."
npm install

echo "✅ Backend setup complete!"
cd ..
echo ""

# Frontend Setup
echo "=========================================="
echo "📦 Setting Up Frontend"
echo "=========================================="
cd frontend

if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    echo "API_BASE_URL=http://localhost:5000/api" > .env
fi

echo "📥 Installing frontend dependencies..."
npm install

echo "✅ Frontend setup complete!"
cd ..
echo ""

# Database Seed (Optional)
echo "=========================================="
echo "🌱 Database Initialization"
echo "=========================================="
read -p "Do you want to seed sample data? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🌱 Seeding database with sample data..."
    cd backend
    npm run seed
    cd ..
fi

echo ""
echo "=========================================="
echo "✅ Setup Complete!"
echo "=========================================="
echo ""
echo "🚀 To start the platform:"
echo "   1. Start MongoDB: mongod"
echo "   2. Start Backend: cd backend && npm run dev"
echo "   3. Start Frontend: cd frontend && npm start"
echo ""
echo "📝 Access URLs:"
echo "   - Frontend: http://localhost:8000"
echo "   - Backend API: http://localhost:5000/api"
echo ""
echo "📚 Documentation:"
echo "   - API Docs: Read backend/routes/*/  files"
echo "   - Architecture: See docs/ARCHITECTURE.md"
echo ""
