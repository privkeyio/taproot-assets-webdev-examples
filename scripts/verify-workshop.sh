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

# Check each part
for part in "8000:Part 1 - CORS Demo" \
            "8001:Part 2 - Gateway Connection" \
            "8002:Part 3 - Starter (Balance Viewer)" \
            "8003:Part 3 - Intermediate (Send/Receive)" \
            "8004:Part 3 - Advanced (Payment Widget)"; do
    IFS=':' read -r port name <<< "$part"
    echo -n "$name (http://localhost:$port): "
    
    if curl -s -o /dev/null -w "%{http_code}" http://localhost:$port | grep -q "200"; then
        echo -e "${GREEN}✓ Running${NC}"
    else
        echo -e "${RED}✗ Not running${NC}"
    fi
done

# Test API endpoints
echo ""
echo "Testing API Endpoints:"
echo "----------------------"

# Test assets endpoint
echo -n "Assets endpoint: "
if curl -s -H "Origin: http://localhost:8001" http://localhost:8080/v1/taproot-assets/assets | grep -q "assets"; then
    echo -e "${GREEN}✓ Working${NC}"
else
    echo -e "${RED}✗ Failed${NC}"
fi

# Test universe endpoint
echo -n "Universe endpoint: "
if curl -s -H "Origin: http://localhost:8001" http://localhost:8080/v1/taproot-assets/universe/roots | grep -q "universe_roots"; then
    echo -e "${GREEN}✓ Working${NC}"
else
    echo -e "${RED}✗ Failed${NC}"
fi

echo ""
echo "==========================================="
echo "✨ Workshop verification complete!"