#!/bin/bash

# Generate a unique token using openssl
LOCAL_TOKEN=$(openssl rand -hex 16)
PRODUCTION_TOKEN=$(openssl rand -hex 32)

# Define the environment variable name
ENV_VAR_NAME="AUTH_KEY"

# Define the .env file path
ENV_FILE="$(dirname "$0")/../.dev.vars"

touch "$ENV_FILE"

# Add or update the token in the .env file
if grep -q "^${ENV_VAR_NAME}=" "$ENV_FILE"; then
        # If the variable already exists, update it
        sed -i '' "s/^${ENV_VAR_NAME}=.*/${ENV_VAR_NAME}=${LOCAL_TOKEN}/" "$ENV_FILE"
else
        # If the variable doesn't exist, append it
        echo "${ENV_VAR_NAME}=${LOCAL_TOKEN}" >>"$ENV_FILE"
fi

# ANSI escape code for green color
GREEN='\033[0;32m'
# ANSI escape code to reset color
NC='\033[0m'

echo -e "Your unique API token has been added to ${ENV_FILE}.\n\n"
echo -e "Run ${GREEN}wrangler secret put AUTH_KEY $PRODUCTION_TOKEN${NC} to add the production\ntoken to Cloudflare.\n\n"
echo -e "Make sure you securely save the AUTH_KEY so you can access the production API."
