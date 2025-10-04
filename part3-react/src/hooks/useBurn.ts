import { useState, useEffect } from 'react';

const GATEWAY_URL = 'http://localhost:8080';

export interface Burn {
  asset_id?: string;
  amount?: string;
  anchor_txid?: string;
  note?: string;
  tweaked_group_key?: string;
}

export function useBurn() {
  const [burns, setBurns] = useState<Burn[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBurns = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${GATEWAY_URL}/v1/taproot-assets/burns`);

      if (!response.ok) {
        throw new Error(`Failed to fetch burns: ${response.statusText}`);
      }

      const data = await response.json();
      setBurns(data.burns || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching burns:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const burnAsset = async (assetId: string, amountToBurn: string, note?: string) => {
    try {
      const confirmationText = 'assets will be destroyed';

      const response = await fetch(`${GATEWAY_URL}/v1/taproot-assets/burn`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          asset_id: assetId,
          amount_to_burn: amountToBurn,
          confirmation_text: confirmationText,
          ...(note && { note })
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Burn failed: ${response.statusText}`);
      }

      const result = await response.json();
      await fetchBurns();
      return result;
    } catch (err) {
      console.error('Error burning asset:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchBurns();
  }, []);

  return { burns, loading, error, burnAsset, refresh: fetchBurns };
}
