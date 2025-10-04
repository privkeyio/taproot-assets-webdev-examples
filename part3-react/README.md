# Part 3: React Taproot Assets Suite

A production-ready React + TypeScript application demonstrating the full capabilities of the REST Gateway.

## Prerequisites

✅ Completed [Part 0](../part0-setup) - REST Gateway running at http://localhost:8080
✅ [Bun](https://bun.sh) installed - `curl -fsSL https://bun.sh/install | bash`
✅ Funded LND wallet in Polar (see [Part 2](../part2-gateway-connection))

## What You'll Learn

This app demonstrates:
- 📊 **Portfolio Management** - View and search all your assets with aggregated balances
- 🪙 **Asset Minting** - Complete wizard: Create → Fund → Finalize → Broadcast
- 📤 **Send Assets** - Transfer assets with proper fee rates (minimum 253 sat/kw)
- 📥 **Receive Assets** - Generate Taproot Asset addresses for any asset
- 📜 **Transfer History** - Track all transactions with TX hash and block info
- 🔥 **Burn Assets** - Permanently destroy assets with confirmation
- 🌐 **Network Stats** - View daemon info and universe statistics

## Quick Start

```bash
# Navigate to part3-react
cd part3-react

# Install dependencies
bun install

# Start the app
bun dev
```

Visit: **http://localhost:5173** (or 5174 if 5173 is in use)

> **Important:** REST Gateway must be running on port 8080!

## Workshop Flow

### 1️⃣ View Your Portfolio
- See all assets from Part 2
- Search and filter by name or asset ID
- Balances are automatically grouped by asset

### 2️⃣ Mint a New Asset
1. Go to **🪙 Mint** tab
2. Choose **Normal** (fungible) or **Collectible** (NFT)
3. Enter asset name and amount
4. Click **Create Asset** → adds to batch
5. Click **Finalize & Broadcast** → commits on-chain
6. Wait ~30 seconds for confirmation

### 3️⃣ Test Send & Receive
1. Go to **📥 Receive** tab
2. Select an asset and click **Generate Address**
3. Copy the address
4. Go to **📤 Send** tab
5. Select asset, paste address, enter amount
6. Click **Send Assets**
7. Check **📜 Transfers** tab to see the transaction

### 4️⃣ Explore Advanced Features
- **🔥 Burn** - Destroy assets permanently
- **🌐 Network** - View daemon info and stats

## Understanding the Code

### React Hooks Pattern
```typescript
// Custom hook handles API calls and state
const { assets, balances, loading, error } = useTaprootAssets();
```

### Auto-Refresh
Data refreshes automatically every 10-30 seconds:
```typescript
useEffect(() => {
  const interval = setInterval(fetchData, 10000);
  return () => clearInterval(interval);
}, []);
```

### Type Safety
Full TypeScript support with proper interfaces:
```typescript
interface Asset {
  asset_id?: string;
  asset_genesis?: AssetGenesis;
  amount?: string;
}
```

## Key Files

```
src/
├── App.tsx                   # Main UI with tabs and send/receive logic
├── components/
│   ├── MintWizard.tsx        # Two-step minting flow
│   ├── TransferHistory.tsx   # Transaction list
│   ├── BurnAssets.tsx        # Asset burning
│   └── NetworkStats.tsx      # Daemon info
└── hooks/
    ├── useTaprootAssets.ts   # Portfolio data
    ├── useMintBatches.ts     # Minting operations
    ├── useTransfers.ts       # Transfer history
    └── useBurn.ts            # Burn operations
```

## Troubleshooting

### Gateway Not Connected?
- Check: `curl http://localhost:8080/health`
- Restart gateway: `cd ../taproot-assets-rest-gateway && cargo run`
- Verify `.env` paths are correct

### "Fee rate below floor" Error
- Minimum fee rate is **253 sat/kw**
- App uses 1000 sat/kw by default (already fixed!)

### No Assets Showing?
- Complete Part 2 to mint assets first
- Wait ~30 seconds for confirmation
- Enable Auto Mine in Polar (30s interval)

### "Bun: command not found"
```bash
curl -fsSL https://bun.sh/install | bash
source ~/.bashrc  # or ~/.zshrc
```

### Port Already in Use?
```bash
lsof -ti:5173 | xargs kill -9
bun dev
```

## What You Learned

✅ Building production React apps with Taproot Assets
✅ Custom hooks for API integration
✅ Type-safe TypeScript with proper interfaces
✅ Complete asset lifecycle: Mint → Send → Receive → Burn
✅ Real-time updates with auto-refresh
✅ Proper error handling and loading states

## Next Steps

- Customize the UI with your own styling
- Add more features (search, filters, charts)
- Integrate with other Lightning/Bitcoin APIs
- Deploy to production with authentication

---

Built with ⚡ Bun + React + TypeScript + Vite