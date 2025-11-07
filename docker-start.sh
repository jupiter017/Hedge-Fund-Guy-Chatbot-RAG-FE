#!/bin/bash
# Quick start script for Frontend Docker deployment

set -e

echo "=================================================="
echo "Frontend - Docker Quick Start"
echo "=================================================="
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    echo "   Visit: https://docs.docker.com/get-docker/"
    exit 1
fi

echo "✅ Docker is installed"
echo ""

# Navigate to frontend directory
cd "$(dirname "$0")"

# Ask what to do
echo "What would you like to do?"
echo ""
echo "1) Production build (Nginx)"
echo "2) Development mode (Vite with hot-reload)"
echo "3) Stop containers"
echo "4) View logs"
echo "5) Clean reset"
echo ""
read -p "Enter choice [1-5]: " choice

case $choice in
    1)
        echo ""
        echo "🚀 Building and starting production frontend..."
        echo ""
        
        # Build and start
        docker build -t hedge-fund-frontend:latest .
        docker run -d \
            --name hedge_fund_frontend \
            -p 80:80 \
            hedge-fund-frontend:latest
        
        echo ""
        echo "✅ Frontend started!"
        echo ""
        echo "🌐 Access at: http://localhost"
        echo "🏥 Health check: http://localhost/health"
        echo ""
        echo "📝 View logs with: docker logs -f hedge_fund_frontend"
        ;;
        
    2)
        echo ""
        echo "💻 Starting development mode..."
        echo ""
        
        docker-compose -f docker-compose.dev.yml up -d
        
        echo ""
        echo "✅ Development server started!"
        echo ""
        echo "🌐 Access at: http://localhost:3000"
        echo "🔥 Hot-reload enabled"
        echo ""
        echo "📝 View logs with: docker-compose -f docker-compose.dev.yml logs -f"
        ;;
        
    3)
        echo ""
        echo "🛑 Stopping containers..."
        
        docker stop hedge_fund_frontend 2>/dev/null || true
        docker rm hedge_fund_frontend 2>/dev/null || true
        docker-compose -f docker-compose.dev.yml down 2>/dev/null || true
        
        echo "✅ Containers stopped"
        ;;
        
    4)
        echo ""
        echo "Which environment?"
        echo "1) Production"
        echo "2) Development"
        read -p "Enter choice [1-2]: " log_choice
        
        case $log_choice in
            1)
                docker logs -f hedge_fund_frontend
                ;;
            2)
                docker-compose -f docker-compose.dev.yml logs -f
                ;;
            *)
                echo "Invalid choice"
                exit 1
                ;;
        esac
        ;;
        
    5)
        echo ""
        echo "⚠️  WARNING: This will remove all containers and images!"
        read -p "Are you sure? (yes/no): " confirm
        
        if [ "$confirm" == "yes" ]; then
            echo ""
            echo "🧹 Cleaning up..."
            
            docker stop hedge_fund_frontend 2>/dev/null || true
            docker rm hedge_fund_frontend 2>/dev/null || true
            docker rmi hedge-fund-frontend:latest 2>/dev/null || true
            docker-compose -f docker-compose.dev.yml down -v 2>/dev/null || true
            
            echo "✅ Cleanup complete!"
        else
            echo "❌ Cleanup cancelled"
        fi
        ;;
        
    *)
        echo "❌ Invalid choice"
        exit 1
        ;;
esac

echo ""
echo "=================================================="

