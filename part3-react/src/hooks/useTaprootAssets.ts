import { useState, useEffect, useCallback } from 'react';
import { taprootAPI } from '../lib/api';
import type { Asset, AssetBalance } from '../lib/api';

export function useTaprootAssets() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [balances, setBalances] = useState<Record<string, AssetBalance>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Check connection
      const health = await taprootAPI.getHealth();
      setConnected(health);
      
      if (!health) {
        throw new Error('Gateway not connected. Make sure the REST Gateway is running on port 8080');
      }

      // Fetch assets and balances
      const [assetsData, balancesData] = await Promise.all([
        taprootAPI.listAssets(),
        taprootAPI.getBalance()
      ]);

      setAssets(assetsData);
      setBalances(balancesData);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
      setConnected(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    
    // Refresh every 10 seconds
    const interval = setInterval(fetchData, 10000);
    
    return () => clearInterval(interval);
  }, [fetchData]);

  return {
    assets,
    balances,
    loading,
    error,
    connected,
    refresh: fetchData,
    lastUpdate: new Date()
  };
}