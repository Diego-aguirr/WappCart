#!/bin/bash
# Generate a secure pepper for ADMIN_PEPPER
# Run this once and copy the output to .env

echo "Generating secure pepper (128 hex chars)..."
PEPPER=$(openssl rand -hex 64)
echo ""
echo "Your new ADMIN_PEPPER:"
echo "$PEPPER"
echo ""
echo "Add this to your .env file:"
echo "ADMIN_PEPPER=\"$PEPPER\""
