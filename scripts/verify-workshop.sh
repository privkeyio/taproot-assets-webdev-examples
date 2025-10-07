#!/bin/bash

echo "🔍 Verifying Taproot Assets Workshop Setup"
echo "==========================================="

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

# Check gateway
echo -n "Gateway (http://localhost:8080): "
if curl -s http://localhost:8080/health | grep -q "healthy"; then
    echo -e "${GREEN}✓ Running${NC}"
else
    echo -e "${RED}✗ Not running${NC}"
    echo "  Start with: cd ../taproot-assets-rest-gateway && cargo run --release"
fi

# Check workshop server
echo -n "Workshop Server (http://localhost:8999): "
if curl -s -o /dev/null -w "%{http_code}" http://localhost:8999 | grep -q "200"; then
    echo -e "${GREEN}✓ Running${NC}"
else
    echo -e "${RED}✗ Not running${NC}"
    echo "  Start with: ./scripts/start-workshop.sh"
fi

# Check each part
for part in "part0-setup:Part 0 - Setup Guide" \
            "part1-cors-demo:Part 1 - CORS Demo" \
            "part2-gateway-connection:Part 2 - Gateway Connection" \
            "part3-starter:Part 3 - Starter (Balance Viewer)"; do
    IFS=':' read -r path name <<< "$part"
    echo -n "$name (http://localhost:8999/$path/): "

    if curl -s -o /dev/null -w "%{http_code}" http://localhost:8999/$path/ | grep -q "200"; then
        echo -e "${GREEN}✓ Running${NC}"
    else
        echo -e "${RED}✗ Not running${NC}"
    fi
done

# Check React app separately (optional)
echo -n "Part 3 - React App (http://localhost:5173): "
if curl -s -o /dev/null -w "%{http_code}" http://localhost:5173 2>/dev/null | grep -q "200"; then
    echo -e "${GREEN}✓ Running${NC}"
else
    echo -e "${RED}✗ Not running (optional)${NC}"
fi

# Test API endpoints
echo ""
echo "Testing API Endpoints:"
echo "----------------------"

# Test assets endpoint
echo -n "Assets endpoint: "
if curl -s -H "Origin: http://localhost:8999" http://localhost:8080/v1/taproot-assets/assets | grep -q "assets"; then
    echo -e "${GREEN}✓ Working${NC}"
else
    echo -e "${RED}✗ Failed${NC}"
fi

# Test universe endpoint
echo -n "Universe endpoint: "
if curl -s -H "Origin: http://localhost:8999" http://localhost:8080/v1/taproot-assets/universe/roots | grep -q "universe_roots"; then
    echo -e "${GREEN}✓ Working${NC}"
else
    echo -e "${RED}✗ Failed${NC}"
fi

echo ""
echo "==========================================="
echo "✨ Workshop verification complete!"