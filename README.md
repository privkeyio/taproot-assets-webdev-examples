# Taproot Assets Web Development Workshop

Breaking down barriers and making Taproot Assets accessible to web developers.

## 🎯 Workshop Overview

This hands-on workshop teaches developers how to build web applications with Taproot Assets by solving the fundamental CORS and authentication barriers that block browser-based development.

**Duration:** 90 minutes  
**Level:** Intermediate  
**Prerequisites:** Basic JavaScript/web development knowledge

## 📚 Workshop Structure

### [Part 0: Setup](./part0-setup) (10 min)
Get the REST Gateway running with your Polar environment.
- Install and configure the gateway
- Connect to your Taproot Assets node
- Verify everything works

### [Part 1: Feel the Pain](./part1-cors-demo) (15 min)
Experience why building Taproot Assets web apps is currently impossible.
- CORS errors when calling TAPD APIs
- Macaroon authentication complexity
- TLS certificate issues

### [Part 2: The Solution](./part2-gateway-connection) (20 min)
Make your first successful browser API calls!
- Connect through the REST Gateway
- Explore 70+ available endpoints
- See clean JSON responses

### [Part 3: Build Real Applications](.) (40 min)
Choose your project based on experience:

#### [Starter: Asset Balance Viewer](./part3-starter)
- Display all Taproot Assets
- Show real-time balances
- Auto-refresh every 10 seconds

#### [Intermediate: Send/Receive Interface](./part3-intermediate)
- Send assets with validation
- Generate QR codes for receiving
- Transaction history

#### [Advanced: Payment Widget](./part3-advanced)
- Embeddable payment component
- Multiple payment methods
- Production-ready callbacks

## 🚀 Quick Start

1. **Prerequisites**
   - [Polar](https://lightningpolar.com/) with TAPD-enabled LND node
   - Rust installed (for the gateway)
   - Python 3 (for serving demo files)
   - Modern web browser
   - Code editor

2. **Set up the REST Gateway**
   ```bash
   # In a separate terminal
   cd ../taproot-assets-rest-gateway
   cargo run --release
   ```

3. **Start the Workshop**
   ```bash
   # Clone and start all demos
   git clone https://github.com/privkeyio/taproot-assets-webdev-examples
   cd taproot-assets-webdev-examples
   chmod +x ./scripts/start-workshop.sh
   ./scripts/start-workshop.sh
   ```

4. **Verify Everything is Running**
   ```bash
   chmod +x ./scripts/verify-workshop.sh
   ./scripts/verify-workshop.sh
   ```

## 🛠️ What You'll Learn

- **Immediate Skills:** Build Taproot Assets web apps that work in browsers
- **Problem Solving:** Understanding and solving CORS issues
- **Authentication:** Handle Lightning macaroons transparently
- **Real Code:** Working JavaScript examples you can use immediately
- **Architecture:** Secure API proxy patterns
- **Performance:** Sub-millisecond overhead techniques

## 📂 Repository Structure

```
taproot-assets-webdev-examples/
├── part0-setup/          # Gateway setup and configuration
├── part1-cors-demo/      # CORS and authentication problems
├── part2-gateway-connection/  # First successful API calls
├── part3-starter/        # Balance viewer application
├── part3-intermediate/   # Send/receive interface
└── part3-advanced/       # Embeddable payment widget
```

## 🎓 Learning Path

### Beginners
1. Complete Part 0-2 to understand the problems and solution
2. Build the Starter project (balance viewer)
3. Experiment with different API endpoints

### Intermediate
1. Complete Part 0-2 quickly
2. Build the Intermediate project (send/receive)
3. Add custom features like address books or transaction memos

### Advanced
1. Skip to Part 2 after setup
2. Build the Advanced widget
3. Integrate it into your own projects
4. Contribute improvements back to the gateway

## 💡 Key Concepts

### The Problem
- Browsers enforce CORS for security
- TAPD doesn't provide CORS headers
- Macaroon authentication is complex
- TLS certificates cause issues

### The Solution
- REST Gateway acts as a proxy
- Handles CORS headers automatically
- Manages authentication server-side
- Provides clean REST endpoints

### Performance
- <0.1ms latency overhead
- 1,500+ requests/second
- Negligible resource usage
- Production-ready

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

## 📝 License

MIT License - feel free to use this code in your projects!

## 🙋 Support

- **Workshop Questions:** Open an issue in this repository
- **Gateway Issues:** [REST Gateway Issues](https://github.com/privkeyio/taproot-assets-rest-gateway/issues)
- **General Help:** [Taproot Assets Discussions](https://github.com/lightninglabs/taproot-assets/discussions)

---

**Built with ❤️ by Kyle Santiago / PrivKey**

Ready to break down barriers? Start with [Part 0: Setup](./part0-setup)!
