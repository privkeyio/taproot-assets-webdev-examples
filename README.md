# Taproot Assets Web Development Workshop

Learn to build web applications with Taproot Assets by solving CORS and authentication barriers.

## 🚀 Quick Start

```bash
# Clone the workshop
git clone https://github.com/privkeyio/taproot-assets-webdev-examples.git
cd taproot-assets-webdev-examples

# Start all demos
./scripts/start-workshop.sh
```

Then visit **http://localhost:8999/part0-setup/** to begin!

**All workshop parts run on one server (port 8999):**
- Part 0: http://localhost:8999/part0-setup/
- Part 1: http://localhost:8999/part1-cors-demo/
- Part 2: http://localhost:8999/part2-gateway-connection/
- Part 3: http://localhost:8999/part3-starter/

Navigate seamlessly between parts using the built-in navigation buttons!

---

## Prerequisites

- [Polar](https://lightningpolar.com/) with TAPD-enabled LND node running
- Rust installed ([rustup.rs](https://rustup.rs))
- Python 3

## What You'll Build

- **Part 0:** REST Gateway setup walkthrough
- **Part 1:** Experience CORS/auth barriers firsthand
- **Part 2:** Mint, send, and receive assets via gateway
- **Part 3:** Build a live portfolio viewer

**Duration:** ~90 minutes

## 💡 The Problem & Solution

**The Problem:**
- Browsers block direct TAPD API calls (CORS)
- Macaroon authentication is complex
- TLS certificates cause issues

**The Solution:**
- REST Gateway acts as a proxy
- Handles CORS and auth automatically
- Clean REST API for browsers

## 🔗 Resources

- [REST Gateway Repository](https://github.com/privkeyio/taproot-assets-rest-gateway)
- [Taproot Assets Documentation](https://docs.lightning.engineering/lightning-network-tools/taproot-assets)
- [Polar Development Environment](https://lightningpolar.com/)

## 🤝 Contributing

Found a bug? Have an improvement? Contributions are welcome!

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

---

**Built with ❤️ by Kyle Santiago / PrivKey**

Ready? Run `./scripts/start-workshop.sh` and visit **http://localhost:8999/part0-setup/**
