# Part 2: Taproot Assets Workshop

Complete workshop to mint, send, and receive Taproot Assets using the REST Gateway.

## Prerequisites

✅ Completed [Part 0](../part0-setup) - REST Gateway running
✅ Polar network with TAPD-enabled LND node running

## Quick Start

### 1. Run Setup Guide

```bash
cd part2-gateway-connection
./setup-wallet.sh
```

This displays step-by-step instructions to:
- Fund your LND wallet using Polar UI
- Enable auto-mining
- Verify you're ready to start

### 2. Fund Your LND Wallet in Polar

**Follow these exact steps:**

1. **Click your LND node** (e.g., "alice")
2. Click **"Deposit Funds"** tab (not "Deposit Assets")
3. Set Amount: **1000000** (1 million sats = 0.01 BTC)
4. Click **"Deposit"** button
5. Polar automatically mines blocks and funds your wallet! ✅

### 3. Enable Auto Mining

1. **Click Bitcoin node** (e.g., "backend1")
2. Click **Actions** → **Auto Mine**
3. Set interval to **30 seconds**
4. Click **Start**

### 4. Open the Workshop

Visit: **http://localhost:8001**

Wait 30-60 seconds for your deposit to confirm, then start minting!

## Workshop Flow

### Step 1: Verify Gateway Connection
- Click **Check Gateway Health** - should show "healthy"
- Click **Get Taproot Assets Info** - see your node details

### Step 2: Mint Your First Asset (Two-Step Process)
- Choose **Asset Type**: Fungible or Collectible
- Enter **Asset Name**: e.g., "WorkshopCoin"
- Set **Amount**: e.g., 1000 (use 1 for NFTs)
- Click **🎨 Mint Asset** → adds to batch
- Click **✅ Finalize Batch** → commits and broadcasts
- **Wait ~30 seconds** for Auto Mine to confirm

### Step 3: View Your Assets
- Click **💰 View Balances** → see total balance grouped by asset
- ✨ **First asset ID is auto-filled in Step 4!**
- Balances are automatically grouped by asset ID and show name, type, and total amount

### Step 4: Generate Receiving Address
- Asset ID is **auto-filled** from Step 3!
- Adjust amount if needed (default: 100)
- Click **📍 Generate Address** → creates a new Taproot Assets address
- Click **📬 List All Addresses** → see your newly generated address
- ✨ **Address is auto-filled in Step 5!**

### Step 5: Send Assets (Test Send to Yourself!)
- Address is **auto-filled** from Step 4!
- Click **🚀 Send Asset**
- **Wait ~30 seconds** for Auto Mine to confirm
- 💡 You're sending to yourself on the same node - perfect for testing!

### Step 6: Advanced Operations
- **📊 List Transfers** - See all send/receive history
- **🌍 Universe Roots** - View universe sync data

## Understanding the Two-Step Minting Process

Taproot Assets uses **batching** for efficiency:

1. **Mint Asset** → Adds your asset to a pending batch
2. **Finalize Batch** → Creates the actual Bitcoin transaction and broadcasts it
3. **Mining** → Confirms the transaction on-chain

This allows multiple assets to be minted in a single Bitcoin transaction, saving fees!

## Troubleshooting

### Gateway Not Connected
- Ensure Part 0 setup is complete
- Check: `curl http://localhost:8080/health`
- Verify gateway `.env` has correct paths

### "Not enough witness outputs" Error
- Your wallet has no funds!
- Use Polar: Click LND node → Deposit → 1000000 sats
- Wait 30 seconds for confirmation

### Asset Not Appearing After Mint
- Did you click **Finalize Batch** after minting?
- Wait 30-60 seconds for Auto Mine to confirm
- Check **View Balances** or Polar TAPD node → Assets tab to verify

### "Asset already in batch" Error
- You already added this asset name to the current batch
- Either use a different name, or click **Finalize Batch** first
- After finalizing, you can mint new assets

### Can't Send Assets
- Ensure asset is confirmed (check **View Balances**)
- Copy the `asset_id` from the View Balances response
- Check you have sufficient balance

## Using Polar UI

### Deposit Funds (Recommended Method)
1. Click **LND node** → **Deposit** tab
2. Enter amount in sats (1000000 = 1 BTC)
3. Click **Deposit**
4. Auto Mine will confirm automatically

### Auto Mine (Highly Recommended)
Click **Bitcoin node** → **Actions** → **Auto Mine**
- Set interval: **30 seconds**
- Click **Start**
- All transactions confirm automatically!

### Mine Blocks Manually
Click **Bitcoin node** → **Actions** → **Mine Blocks**
- Enter number: usually 6
- Click **Mine**

### Check Wallet Balance
Click **LND node** → **Info** tab
- View confirmed balance
- View pending balance

## What You Learned

✅ **Complete Asset Lifecycle** - All in one UI: Mint → View → Generate Address → Send
✅ **REST Gateway Benefits**:
   - ✨ CORS-enabled - Works directly from browser
   - 🔓 No authentication complexity - Simple fetch() calls
   - 📊 Clean JSON responses - Easy to parse and display
   - 🚀 Self-contained testing - Send to yourself on same node
✅ **Two-step minting** process: Batch → Finalize → Confirm
✅ **Auto-population** - Seamless workflow with no copy/paste needed
✅ **Real-time balance grouping** - See total assets across all UTXOs

## Next Steps

Ready to build a live portfolio viewer? Continue to [Part 3](../part3-starter)!

---

💡 **Pro Tip**: Enable Auto Mine (30s) at the start and deposit 1 BTC to your LND wallet - then the workshop runs completely hands-free!
