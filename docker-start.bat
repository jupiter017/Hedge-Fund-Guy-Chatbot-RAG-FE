@echo off
REM Quick start script for Frontend Docker deployment (Windows)

echo ==================================================
echo Frontend - Docker Quick Start
echo ==================================================
echo.

REM Check if Docker is installed
docker --version >nul 2>&1
if errorlevel 1 (
    echo Error: Docker is not installed.
    echo Visit: https://docs.docker.com/get-docker/
    exit /b 1
)

echo Docker is installed
echo.

REM Navigate to frontend directory
cd /d "%~dp0"

REM Menu
echo What would you like to do?
echo.
echo 1^) Production build ^(Nginx^)
echo 2^) Development mode ^(Vite with hot-reload^)
echo 3^) Stop containers
echo 4^) View logs
echo 5^) Clean reset
echo.
set /p choice="Enter choice [1-5]: "

if "%choice%"=="1" (
    echo.
    echo Building and starting production frontend...
    echo.
    
    docker build -t hedge-fund-frontend:latest .
    docker run -d --name hedge_fund_frontend -p 80:80 hedge-fund-frontend:latest
    
    echo.
    echo Frontend started!
    echo.
    echo Access at: http://localhost
    echo Health check: http://localhost/health
    echo.
    echo View logs with: docker logs -f hedge_fund_frontend
    
) else if "%choice%"=="2" (
    echo.
    echo Starting development mode...
    echo.
    
    docker-compose -f docker-compose.dev.yml up -d
    
    echo.
    echo Development server started!
    echo.
    echo Access at: http://localhost:3000
    echo Hot-reload enabled
    echo.
    echo View logs with: docker-compose -f docker-compose.dev.yml logs -f
    
) else if "%choice%"=="3" (
    echo.
    echo Stopping containers...
    
    docker stop hedge_fund_frontend 2>nul
    docker rm hedge_fund_frontend 2>nul
    docker-compose -f docker-compose.dev.yml down 2>nul
    
    echo Containers stopped
    
) else if "%choice%"=="4" (
    echo.
    echo Which environment?
    echo 1^) Production
    echo 2^) Development
    set /p log_choice="Enter choice [1-2]: "
    
    if "%log_choice%"=="1" (
        docker logs -f hedge_fund_frontend
    ) else if "%log_choice%"=="2" (
        docker-compose -f docker-compose.dev.yml logs -f
    ) else (
        echo Invalid choice
        exit /b 1
    )
    
) else if "%choice%"=="5" (
    echo.
    echo WARNING: This will remove all containers and images!
    set /p confirm="Are you sure? (yes/no): "
    
    if "%confirm%"=="yes" (
        echo.
        echo Cleaning up...
        
        docker stop hedge_fund_frontend 2>nul
        docker rm hedge_fund_frontend 2>nul
        docker rmi hedge-fund-frontend:latest 2>nul
        docker-compose -f docker-compose.dev.yml down -v 2>nul
        
        echo Cleanup complete!
    ) else (
        echo Cleanup cancelled
    )
    
) else (
    echo Invalid choice
    exit /b 1
)

echo.
echo ==================================================
pause

