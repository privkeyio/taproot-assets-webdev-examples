# Part 3: Taproot Assets Portfolio

Build your first Taproot Assets application - a real-time portfolio viewer.

## What You'll Build

A live dashboard that:
- Displays all your Taproot Assets
- Shows real-time balances
- Auto-refreshes every 10 seconds
- Fetches node information

## Run the Application

If you ran `./scripts/start-workshop.sh` from Part 0, this application is already running.

**Visit:** http://localhost:8002

## Features Implemented

### 📊 Statistics Dashboard
- Total number of assets
- Combined balance value
- Current block height

### 💎 Asset Cards
- Asset name and type (Fungible/Collectible)
- Current balance with formatting
- Total supply
- Genesis block information
- Decimal places

### 🔄 Auto-Refresh
- Updates every 10 seconds
- Manual refresh button
- Loading states
- Error handling

## Code Walkthrough

### Fetching Assets
```javascript
async function fetchAssets() {
    const response = await fetch(`${GATEWAY_URL}/v1/taproot-assets/assets`);
    const data = await response.json();
    return data.assets || [];
}
```

### Fetching Balances
```javascript
async function fetchBalances() {
    const response = await fetch(`${GATEWAY_URL}/v1/taproot-assets/assets/balances`);
    const data = await response.json();
    return data.asset_balances || {};
}
```

### Auto-Refresh Logic
```javascript
function startAutoRefresh() {
    refreshBalances();
    autoRefreshInterval = setInterval(refreshBalances, 10000);
}
```

## Customize It!

Try adding:
- Search/filter by asset name
- Sort by balance or creation date  
- Export to CSV
- Dark mode toggle
- Price feeds integration

## API Endpoints Used

- `/v1/taproot-assets/assets` - List all assets
- `/v1/taproot-assets/assets/balances` - Get balances
- `/v1/lnd/getinfo` - Node information

---
Ready for more? Try the [Intermediate project](../part3-intermediate)