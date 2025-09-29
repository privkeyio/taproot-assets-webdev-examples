# Part 1: Feel the Pain - CORS & Authentication Barriers

Experience firsthand why building Taproot Assets web apps is currently impossible.

## What You'll Learn

- Why browsers block direct TAPD connections
- How CORS policies prevent API calls
- The complexity of macaroon authentication
- Why TLS certificates cause issues

## Run the Demo

1. **Open the demo page:**
```bash
# From this directory
python3 -m http.server 8000
# Or
npx serve .
```

2. **Visit:** http://localhost:8000

3. **Click the buttons to see:**
   - Direct API calls fail with CORS errors
   - Macaroon authentication complexity
   - TLS certificate problems

## What's Happening?

### 🚫 CORS Errors
When you click "Try Direct API Call", the browser blocks the request because:
- TAPD doesn't send `Access-Control-Allow-Origin` headers
- Browsers enforce same-origin policy for security
- No way to fix this without modifying TAPD itself

### 🔐 Macaroon Complexity
The authentication requires:
- Reading binary macaroon files from disk
- Converting to hex/base64 encoding
- Adding special gRPC headers
- Keeping sensitive credentials secure

### 🔒 TLS Issues
Self-signed certificates mean:
- Browsers reject the connection
- Can't easily import custom CAs
- Even bypassing cert checks doesn't solve CORS

## The Error You'll See

```
Access to fetch at 'https://127.0.0.1:8289/v1/taproot-assets/assets' 
from origin 'http://localhost:8000' has been blocked by CORS policy
```

## Why This Matters

**Every web developer hits this wall immediately.**

You can't build:
- Web wallets
- Payment interfaces  
- Asset explorers
- Any browser-based TAPD application

...without solving these fundamental issues first.

---
Ready for the solution? Continue to [Part 2](../part2-gateway-connection)