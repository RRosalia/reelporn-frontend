#!/bin/bash

echo "🚀 Next.js 16 + Bun Quick Start Script"
echo "======================================="
echo ""

# Check if .next exists and remove it
if [ -d ".next" ]; then
    echo "📁 Cleaning old .next directory..."
    sudo rm -rf .next 2>/dev/null || rm -rf .next
fi

# Create fresh .next directory
echo "📁 Creating fresh .next directory..."
mkdir -p .next
chmod 777 .next

echo "✅ Setup complete!"
echo ""
echo "Now run one of these commands:"
echo ""
echo "  🐳 With Docker:     cd .. && docker-compose up --build frontend"
echo "  💻 Locally:         bun run dev"
echo ""
