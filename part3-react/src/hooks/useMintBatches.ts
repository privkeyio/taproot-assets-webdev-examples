import { useState, useEffect } from 'react';

const GATEWAY_URL = 'http://localhost:8080';

export interface MintBatch {
  batch_key?: string;
  batch_txid?: string;
  state?: string;
  assets?: any[];
  created_at?: string;
  height_hint?: number;
  batch_psbt?: string;
}

export function useMintBatches() {
  const [batches, setBatches] = useState<MintBatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBatches = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${GATEWAY_URL}/v1/taproot-assets/assets/mint/batches/`);

      if (!response.ok) {
        throw new Error(`Failed to fetch mint batches: ${response.statusText}`);
      }

      const data = await response.json();
      setBatches(data.batches || []);
      setError(null);
    } catch (err) {
      console.error('[useMintBatches] Error fetching mint batches:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const mintAsset = async (assetType: 'NORMAL' | 'COLLECTIBLE', name: string, amount: string, metadata?: string) => {
    try {
      const response = await fetch(`${GATEWAY_URL}/v1/taproot-assets/assets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          asset: {
            asset_type: assetType,
            name,
            amount: assetType === 'COLLECTIBLE' ? '1' : amount,
            ...(metadata && { asset_meta: { data: btoa(metadata), type: '0' } })
          },
          short_response: true
        })
      });

      if (!response.ok) {
        throw new Error(`Mint failed: ${response.statusText}`);
      }

      const result = await response.json();
      await fetchBatches();
      return result;
    } catch (err) {
      console.error('[useMintBatches] Error minting asset:', err);
      throw err;
    }
  };

  const fundBatch = async (batchKey: string, feeRate?: number) => {
    try {
      // Minimum fee rate is 253 sat/kw, default to 500 for safety
      const safeFeeRate = feeRate && feeRate >= 253 ? feeRate : 500;

      const response = await fetch(`${GATEWAY_URL}/v1/taproot-assets/assets/mint/fund`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          short_response: true,
          fee_rate: safeFeeRate
        })
      });

      if (!response.ok) {
        throw new Error(`Fund batch failed: ${response.statusText}`);
      }

      await fetchBatches();
      return await response.json();
    } catch (err) {
      console.error('Error funding batch:', err);
      throw err;
    }
  };

  const finalizeBatch = async (feeRate?: number) => {
    try {
      // fee_rate is required by the API, default to 1000 sat/kw
      const safeFeeRate = feeRate && feeRate >= 253 ? feeRate : 1000;

      // Check if there's a funded batch (has batch_psbt)
      const fundedBatch = batches.find(b => b.batch_psbt);

      const requestBody: any = {
        short_response: true
      };

      // Only include fee_rate if batch is NOT already funded
      if (!fundedBatch) {
        requestBody.fee_rate = safeFeeRate;
      }

      const response = await fetch(`${GATEWAY_URL}/v1/taproot-assets/assets/mint/finalize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || `Finalize batch failed: ${response.statusText}`);
      }

      await fetchBatches();
      return result;
    } catch (err) {
      throw err;
    }
  };

  const cancelBatch = async () => {
    try {
      const response = await fetch(`${GATEWAY_URL}/v1/taproot-assets/assets/mint/cancel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) {
        throw new Error(`Cancel batch failed: ${response.statusText}`);
      }

      await fetchBatches();
      return await response.json();
    } catch (err) {
      console.error('Error canceling batch:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchBatches();
    const interval = setInterval(fetchBatches, 15000); // Refresh every 15s
    return () => clearInterval(interval);
  }, []);

  return {
    batches,
    loading,
    error,
    refresh: fetchBatches,
    mintAsset,
    fundBatch,
    finalizeBatch,
    cancelBatch
  };
}
