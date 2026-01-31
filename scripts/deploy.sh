#!/bin/bash

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== Deployment Script ===${NC}"
echo ""

# Prompt for server details
read -p "Server URL/IP: " SERVER
read -p "SSH User: " USER
read -p "Deployment folder (e.g., /opt/experiment-game): " DEPLOY_DIR

# Validate inputs
if [[ -z "$SERVER" || -z "$USER" || -z "$DEPLOY_DIR" ]]; then
    echo -e "${RED}Error: All fields are required${NC}"
    exit 1
fi

echo ""
echo -e "${YELLOW}Deploying to ${USER}@${SERVER}:${DEPLOY_DIR}${NC}"
echo ""

# Create deployment directory on server
echo -e "${GREEN}[1/5] Creating deployment directory...${NC}"
ssh "${USER}@${SERVER}" "mkdir -p ${DEPLOY_DIR}"

# Copy project files
echo -e "${GREEN}[2/5] Copying project files...${NC}"
rsync -avz --progress \
    --exclude '.git' \
    --exclude '__pycache__' \
    --exclude '*.pyc' \
    --exclude '.env' \
    --exclude '.env.local' \
    --exclude 'venv' \
    --exclude 'node_modules' \
    ./ "${USER}@${SERVER}:${DEPLOY_DIR}/"

# Copy production environment file
echo -e "${GREEN}[3/5] Copying production environment file...${NC}"
scp .env.prod "${USER}@${SERVER}:${DEPLOY_DIR}/.env"

# Deploy with docker-compose
echo -e "${GREEN}[4/5] Building and starting containers...${NC}"
ssh "${USER}@${SERVER}" "cd ${DEPLOY_DIR} && docker compose -f docker-compose.prod.yml up -d --build"

# Show status
echo -e "${GREEN}[5/5] Checking deployment status...${NC}"
ssh "${USER}@${SERVER}" "cd ${DEPLOY_DIR} && docker compose -f docker-compose.prod.yml ps"

echo ""
echo -e "${GREEN}=== Deployment complete ===${NC}"
