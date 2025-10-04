import { useState, useEffect } from 'react';

const GATEWAY_URL = 'http://localhost:8080';

export interface UniverseStats {
  num_total_assets?: number;
  num_total_groups?: number;
  num_total_syncs?: number;
  num_total_proofs?: number;
}

export interface DaemonInfo {
  version?: string;
  lnd_version?: string;
  network?: string;
  identity_pubkey?: string;
  lnd_identity_pubkey?: string;
  debug_level?: string;
}

export function useNetworkStats() {
  const [stats, setStats] = useState<UniverseStats | null>(null);
  const [daemonInfo, setDaemonInfo] = useState<DaemonInfo | null>(null);
  const [assetStats, setAssetStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);

      // Fetch universe stats
      const statsResponse = await fetch(`${GATEWAY_URL}/v1/taproot-assets/universe/stats`);
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData);
      }

      // Fetch daemon info
      const infoResponse = await fetch(`${GATEWAY_URL}/v1/taproot-assets/getinfo`);
      if (infoResponse.ok) {
        const infoData = await infoResponse.json();
        setDaemonInfo(infoData);
      }

      // Fetch asset stats
      const assetStatsResponse = await fetch(`${GATEWAY_URL}/v1/taproot-assets/universe/stats/assets`);
      if (assetStatsResponse.ok) {
        const assetStatsData = await assetStatsResponse.json();
        setAssetStats(assetStatsData.asset_stats || []);
      }

      setError(null);
    } catch (err) {
      console.error('Error fetching network stats:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, []);

  return { stats, daemonInfo, assetStats, loading, error, refresh: fetchStats };
}
