#!/bin/bash

# Docker helper script for Unix/Linux/Mac

usage() {
    cat <<EOF
Usage: ./docker-dev.sh [command]

Commands:
  up          - Start all services
  down        - Stop all services
  logs        - View logs from all services
  build       - Build images
  shell       - Open backend container shell
  test        - Run tests
  seed        - Seed database with initial users
  clean       - Clean up containers and volumes
  mongo       - Open MongoDB shell

Examples:
  ./docker-dev.sh up
  ./docker-dev.sh logs
  ./docker-dev.sh shell
EOF
}

if [ -z "$1" ]; then
    usage
    exit 0
fi

case "$1" in
    up)
        docker-compose up -d
        echo "Services started. Check status with: docker-compose ps"
        ;;
    down)
        docker-compose down
        echo "Services stopped."
        ;;
    logs)
        docker-compose logs -f
        ;;
    build)
        docker-compose build
        echo "Build complete."
        ;;
    shell)
        docker-compose exec backend sh
        ;;
    test)
        docker-compose exec backend npm test
        ;;
    seed)
        docker-compose exec backend npm run seed:users
        ;;
    mongo)
        docker-compose exec mongo mongosh -u admin -p password123
        ;;
    clean)
        docker-compose down -v
        echo "All containers and volumes removed."
        ;;
    *)
        echo "Unknown command: $1"
        usage
        exit 1
        ;;
esac
