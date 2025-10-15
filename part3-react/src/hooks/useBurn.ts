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

      // Check if the response contains an error (API returns 200 OK even for errors)
      if (result.code) {
        const errorMsg = result.message || 'Burn operation failed';

        // Provide more helpful error messages for common issues
        if (errorMsg.includes('burning all assets of an anchor output is not supported')) {
          throw new Error(
            'Cannot burn: This is the only asset in its UTXO. ' +
            'For collectibles, you need multiple units across different UTXOs to burn any. ' +
            'For divisible assets, try burning a smaller amount or send some to yourself first to create multiple UTXOs.'
          );
        }

        if (errorMsg.includes('unable to select coins') || errorMsg.includes('funding')) {
          throw new Error(
            'Insufficient funds or UTXOs not ready. The asset might need to be confirmed on-chain first. ' +
            'Try mining some blocks in Polar and waiting a moment.'
          );
        }

        throw new Error(errorMsg);
      }

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
