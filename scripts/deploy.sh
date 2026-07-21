#!/bin/bash
set -e

NGINX_CONF="/etc/nginx/sites-available/alpine-korea.co.kr"
BLUE_PORT=3062
GREEN_PORT=3063

echo "=== Starting Alpine Korea Blue-Green Deployment ==="

# Check active port from Nginx configuration
if [ -f "$NGINX_CONF" ]; then
  CURRENT_PORT=$(grep -oP 'proxy_pass http://127.0.0.1:\K[0-9]+' "$NGINX_CONF" | head -n1 || echo "")
else
  CURRENT_PORT=""
fi

if [ "$CURRENT_PORT" = "$BLUE_PORT" ]; then
  TARGET_PORT=$GREEN_PORT
  TARGET_COLOR="green"
  CURRENT_COLOR="blue"
  TARGET_CONTAINER="alpine-korea-green"
  CURRENT_CONTAINER="alpine-korea-blue"
else
  TARGET_PORT=$BLUE_PORT
  TARGET_COLOR="blue"
  CURRENT_COLOR="green"
  TARGET_CONTAINER="alpine-korea-blue"
  CURRENT_CONTAINER="alpine-korea-green"
fi

echo "Current Active Port: ${CURRENT_PORT:-None}"
echo "Target Container: $TARGET_CONTAINER (Port: $TARGET_PORT)"

# Cleanup target container if running
echo "Cleaning up existing target container if any..."
docker stop $TARGET_CONTAINER 2>/dev/null || true
docker rm $TARGET_CONTAINER 2>/dev/null || true

# Build new docker image
echo "Building Docker image alpine-korea:latest..."
docker build -t alpine-korea:latest .

# Ensure mariadb_default network exists
docker network inspect mariadb_default >/dev/null 2>&1 || docker network create mariadb_default

# Run target container
echo "Starting container $TARGET_CONTAINER on port $TARGET_PORT..."
docker run -d \
  --name $TARGET_CONTAINER \
  --restart unless-stopped \
  -p 127.0.0.1:$TARGET_PORT:80 \
  --network mariadb_default \
  alpine-korea:latest

# Health check loop
echo "Waiting for $TARGET_CONTAINER to become healthy..."
HEALTH_CHECK_PASSED=false
for i in $(seq 1 15); do
  HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:$TARGET_PORT/api/health || true)
  if [ "$HTTP_STATUS" = "200" ]; then
    echo "Health check PASSED! (HTTP 200)"
    HEALTH_CHECK_PASSED=true
    break
  fi
  echo "Attempt $i/15: Status $HTTP_STATUS, retrying in 2s..."
  sleep 2
done

if [ "$HEALTH_CHECK_PASSED" = false ]; then
  echo "ERROR: Health check failed for $TARGET_CONTAINER on port $TARGET_PORT. Aborting deployment!"
  docker stop $TARGET_CONTAINER || true
  docker rm $TARGET_CONTAINER || true
  exit 1
fi

# Switch Nginx upstream port if config exists
if [ -f "$NGINX_CONF" ]; then
  echo "Updating Nginx configuration to point to port $TARGET_PORT..."
  sudo sed -i "s/proxy_pass http:\/\/127.0.0.1:[0-9]*/proxy_pass http:\/\/127.0.0.1:$TARGET_PORT/g" "$NGINX_CONF"
  sudo nginx -t
  sudo systemctl reload nginx
  echo "Nginx successfully reloaded to port $TARGET_PORT."
fi

# Stop old container
if [ -n "$CURRENT_PORT" ]; then
  echo "Stopping old container $CURRENT_CONTAINER..."
  docker stop $CURRENT_CONTAINER 2>/dev/null || true
  docker rm $CURRENT_CONTAINER 2>/dev/null || true
fi

# Cleanup old images
docker image prune -f

echo "=== Deployment Completed Successfully! Active Container: $TARGET_CONTAINER (Port: $TARGET_PORT) ==="
