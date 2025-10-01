# Part 0: REST Gateway Setup

Get your development environment ready in 5 minutes.

## Prerequisites

✅ **Polar** running with an LND node that has Taproot Assets enabled
✅ **Rust** installed (for the gateway)
✅ **Git** to clone repositories

## Quick Start

```bash
# Clone the workshop repository
git clone https://github.com/privkeyio/taproot-assets-webdev-examples.git
cd taproot-assets-webdev-examples
```

## Step 1: Clone the REST Gateway

In a **separate directory** (not inside the workshop repo):

```bash
# Navigate to your projects folder
cd ..

# Clone the gateway
git clone https://github.com/privkeyio/taproot-assets-rest-gateway.git
cd taproot-assets-rest-gateway
```

## Step 2: Configure Your Environment

Create a `.env` file:

```bash
cp .env.example .env
```

Edit `.env` with your Polar node details:

```env
# Your Polar TAPD node details
TAPROOT_ASSETS_HOST=127.0.0.1:8289

# Find these in Polar (right-click node → "Connect" → "File Paths")
TAPD_MACAROON_PATH=/home/yourname/.polar/networks/3/volumes/tapd/alice-tap/data/regtest/admin.macaroon
LND_MACAROON_PATH=/home/yourname/.polar/networks/3/volumes/lnd/alice/data/chain/bitcoin/regtest/admin.macaroon

# For development with self-signed certificates
TLS_VERIFY=false

# Gateway settings
SERVER_ADDRESS=127.0.0.1:8080
CORS_ORIGINS=http://localhost:8000,http://localhost:8001,http://localhost:8002,http://localhost:8003,http://localhost:8004
```

## Step 3: Start the Gateway

Using Cargo (Rust):
```bash
cargo run
```

## Step 4: Run All Workshop Demos

Back in the workshop repository:

```bash
cd ../taproot-assets-webdev-examples
./scripts/start-workshop.sh
```

This starts all demo servers on ports 8000-8004.

## Step 5: Verify Everything Works

```bash
./scripts/verify-workshop.sh
```

You should see all services reporting as healthy.

## ✅ Success!

Your REST Gateway is now running at `http://localhost:8080`

The gateway handles:
- CORS headers automatically
- Macaroon authentication
- TLS certificate validation
- Clean REST API endpoints

## Troubleshooting

**Gateway can't connect?**
- Check your Polar network is running
- Verify the paths in `.env` are correct
- Make sure ports 8289 (tapd) and 8080 (gateway) are accessible

**Permission denied on macaroon?**
- The Docker container needs read access to your Polar files
- Try: `chmod 644 /path/to/admin.macaroon`

---
Ready? Proceed to [Part 1](../part1-cors-demo) to see why this gateway is necessary!