#!/bin/bash

# Setup script for Cypress UI with X11 forwarding on macOS
# This script helps you set up XQuartz for interactive Cypress testing

echo "🚀 Cypress UI Setup for macOS"
echo "=============================="
echo ""

# Check if XQuartz is installed
if ! command -v xquartz &> /dev/null; then
    echo "❌ XQuartz is not installed"
    echo ""
    echo "Please install XQuartz first:"
    echo "  brew install --cask xquartz"
    echo ""
    echo "After installing, restart your Mac and run this script again."
    exit 1
fi

echo "✅ XQuartz is installed"
echo ""

# Check if XQuartz is running
if ! pgrep -x "XQuartz" > /dev/null; then
    echo "⚠️  XQuartz is not running. Starting XQuartz..."
    open -a XQuartz
    echo "⏳ Waiting for XQuartz to start..."
    sleep 3
fi

echo "✅ XQuartz is running"
echo ""

# Get IP address
IP=$(ifconfig en0 | grep inet | awk '$1=="inet" {print $2}')

if [ -z "$IP" ]; then
    echo "⚠️  Could not detect IP from en0, trying en1..."
    IP=$(ifconfig en1 | grep inet | awk '$1=="inet" {print $2}')
fi

if [ -z "$IP" ]; then
    echo "❌ Could not detect your IP address"
    echo "Please run manually:"
    echo "  export IP=\$(ifconfig en0 | grep inet | awk '\$1==\"inet\" {print \$2}')"
    echo "  xhost + \$IP"
    exit 1
fi

echo "📡 Your IP: $IP"
echo ""

# Allow Docker to connect
echo "🔓 Allowing Docker to connect to X11..."
xhost + $IP

echo ""
echo "✅ Setup complete!"
echo ""
echo "📝 Next steps:"
echo "  1. Restart the frontend container:"
echo "     docker-compose restart frontend"
echo ""
echo "  2. Open Cypress UI:"
echo "     docker exec reelporn_frontend bun run cypress:open"
echo ""
echo "  3. Or run tests with visible browser:"
echo "     docker exec reelporn_frontend bun run test:e2e:headed"
echo ""
echo "⚠️  Note: You'll need to run this script again if you restart your Mac"
echo ""
