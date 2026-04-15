@echo off
REM Docker helper script for Windows

setlocal enabledelayedexpansion

if "%1"=="" (
    echo Usage: docker-dev.bat [command]
    echo.
    echo Commands:
    echo   up          - Start all services
    echo   down        - Stop all services
    echo   logs        - View logs from all services
    echo   build       - Build images
    echo   shell       - Open backend container shell
    echo   test        - Run tests
    echo   seed        - Seed database with initial users
    echo   clean       - Clean up containers and volumes
    echo.
    exit /b 0
)

if "%1"=="up" (
    docker-compose up -d
    echo Services started. Check status with: docker-compose ps
    exit /b 0
)

if "%1"=="down" (
    docker-compose down
    echo Services stopped.
    exit /b 0
)

if "%1"=="logs" (
    docker-compose logs -f
    exit /b 0
)

if "%1"=="build" (
    docker-compose build
    echo Build complete.
    exit /b 0
)

if "%1"=="shell" (
    docker-compose exec backend sh
    exit /b 0
)

if "%1"=="test" (
    docker-compose exec backend npm test
    exit /b 0
)

if "%1"=="seed" (
    docker-compose exec backend npm run seed:users
    exit /b 0
)

if "%1"=="clean" (
    docker-compose down -v
    echo All containers and volumes removed.
    exit /b 0
)

echo Unknown command: %1
exit /b 1
