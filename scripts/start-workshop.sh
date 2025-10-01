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

(cd "$PROJECT_ROOT/part1-cors-demo" && python3 -m http.server 8000 2>/dev/null) &
echo -e "${GREEN}✅ Part 1 (CORS Demo): http://localhost:8000${NC}"

(cd "$PROJECT_ROOT/part2-gateway-connection" && python3 -m http.server 8001 2>/dev/null) &
echo -e "${GREEN}✅ Part 2 (Gateway Connection): http://localhost:8001${NC}"

(cd "$PROJECT_ROOT/part3-starter" && python3 -m http.server 8002 2>/dev/null) &
echo -e "${GREEN}✅ Part 3 Starter (Balance Viewer): http://localhost:8002${NC}"

(cd "$PROJECT_ROOT/part3-intermediate" && python3 -m http.server 8003 2>/dev/null) &
echo -e "${GREEN}✅ Part 3 Intermediate (Send/Receive): http://localhost:8003${NC}"

(cd "$PROJECT_ROOT/part3-advanced" && python3 -m http.server 8004 2>/dev/null) &
echo -e "${GREEN}✅ Part 3 Advanced (Payment Widget): http://localhost:8004/demo.html${NC}"

echo ""
echo "================================================"
echo "🎉 All servers running! Visit the URLs above to start the workshop."
echo ""
echo "Press Ctrl+C to stop all servers."
echo "================================================"

# Keep script running
wait