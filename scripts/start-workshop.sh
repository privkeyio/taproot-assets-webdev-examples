#!/bin/bash

echo "🚀 Starting Taproot Assets Workshop Environment"
echo "================================================"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if gateway is running
echo -e "${BLUE}Checking REST Gateway...${NC}"
if curl -s http://localhost:8080/health > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Gateway is running at http://localhost:8080${NC}"
else
    echo "❌ Gateway not running. Please start it first:"
    echo "   cd ../taproot-assets-rest-gateway && cargo run"
    exit 1
fi

# Kill any existing Python servers
echo -e "${BLUE}Cleaning up existing servers...${NC}"
pkill -f "python3 -m http.server" 2>/dev/null

# Start all demo servers
echo -e "${BLUE}Starting demo servers...${NC}"

# Get the project root directory (parent of scripts/)
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$( cd "$SCRIPT_DIR/.." && pwd )"

# Serve from project root so assets are accessible and all parts on same server
(cd "$PROJECT_ROOT" && python3 -m http.server 8999 2>/dev/null) &
echo -e "${GREEN}✅ Workshop Server: http://localhost:8999${NC}"
echo ""
echo -e "  ${BLUE}Part 0 (Setup Guide):${NC} http://localhost:8999/part0-setup/"
echo -e "  ${BLUE}Part 1 (CORS Demo):${NC} http://localhost:8999/part1-cors-demo/"
echo -e "  ${BLUE}Part 2 (Gateway):${NC} http://localhost:8999/part2-gateway-connection/"
echo -e "  ${BLUE}Part 3 Starter:${NC} http://localhost:8999/part3-starter/"
echo ""
echo -e "${BLUE}To run Part 3 React (optional):${NC}"
echo -e "  cd part3-react && bun install && bun run dev"
echo -e "  Then visit: http://localhost:5173/"

echo ""
echo "================================================"
echo "🎉 All servers running! Visit the URLs above to start the workshop."
echo ""
echo "Press Ctrl+C to stop all servers."
echo "================================================"

# Keep script running
wait