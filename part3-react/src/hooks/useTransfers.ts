import { useState, useEffect } from 'react';

const GATEWAY_URL = 'http://localhost:8080';

export interface Transfer {
  old_anchor_point?: string;
  new_anchor_point?: string;
  outputs?: any[];
  transfer_timestamp?: string;
  anchor_tx_hash?: string;
  anchor_tx_height_hint?: number;
  anchor_tx_chain_fees?: string;
  inputs?: any[];
}

export function useTransfers() {
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTransfers = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${GATEWAY_URL}/v1/taproot-assets/assets/transfers`);

      if (!response.ok) {
        throw new Error(`Failed to fetch transfers: ${response.statusText}`);
      }

      const data = await response.json();
      setTransfers(data.transfers || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching transfers:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransfers();
    const interval = setInterval(fetchTransfers, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  return { transfers, loading, error, refresh: fetchTransfers };
}
