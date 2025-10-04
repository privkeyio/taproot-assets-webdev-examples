import { useState } from 'react';
import { useTaprootAssets } from '../hooks/useTaprootAssets';

export function ProofsExplorer() {
  const { assets } = useTaprootAssets();
  const [selectedAsset, setSelectedAsset] = useState('');
  const [proofData, setProofData] = useState<any>(null);
  const [verificationResult, setVerificationResult] = useState<any>(null);
  const [decodedProof, setDecodedProof] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Group assets by asset_id
  const groupedAssets = (() => {
    const map = new Map();
    assets.forEach((asset) => {
      const assetId = asset.asset_id || asset.asset_genesis?.asset_id || '';
      if (!map.has(assetId)) {
        map.set(assetId, asset);
      }
    });
    return Array.from(map.values());
  })();

  const hexToBase64 = (hex: string): string => {
    const bytes = new Uint8Array(hex.match(/.{1,2}/g)?.map(byte => parseInt(byte, 16)) || []);
    return btoa(String.fromCharCode(...bytes));
  };

  const exportProof = async () => {
    if (!selectedAsset) {
      setError('Please select an asset');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const asset = assets.find(a => (a.asset_id || a.asset_genesis?.asset_id) === selectedAsset);
      if (!asset) throw new Error('Asset not found');

      const scriptKey = asset.script_key;
      const outpoint = asset.chain_anchor?.anchor_outpoint?.split(':');
      if (!outpoint || outpoint.length !== 2) {
        throw new Error('Invalid anchor outpoint');
      }

      const response = await fetch('http://localhost:8080/v1/taproot-assets/proofs/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          asset_id: selectedAsset,
          script_key: scriptKey,
          outpoint: {
            txid: hexToBase64(outpoint[0]),
            output_index: parseInt(outpoint[1])
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to export proof');
      }

      const data = await response.json();
      setProofData(data);
      setSuccess('Proof exported successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to export proof');
    } finally {
      setLoading(false);
    }
  };

  const verifyProof = async () => {
    if (!proofData) {
      setError('Please export a proof first');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch('http://localhost:8080/v1/taproot-assets/proofs/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          raw_proof_file: proofData.raw_proof_file,
          genesis_point: proofData.genesis_point
        })
      });

      if (!response.ok) throw new Error('Verification failed');

      const data = await response.json();
      setVerificationResult(data);
      setSuccess('✅ Proof verified successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const decodeProof = async () => {
    if (!proofData) {
      setError('Please export a proof first');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch('http://localhost:8080/v1/taproot-assets/proofs/decode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          raw_proof: proofData.raw_proof_file,
          proof_at_depth: 0,
          with_prev_witnesses: true,
          with_meta_reveal: true
        })
      });

      if (!response.ok) throw new Error('Decode failed');

      const data = await response.json();
      setDecodedProof(data);
      setSuccess('Proof decoded successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Decode failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <h2 style={{ color: '#ffffff', marginBottom: '10px', textAlign: 'center' }}>
        📜 Proofs Explorer
      </h2>
      <p style={{ color: '#a0a0a0', textAlign: 'center', marginBottom: '30px', fontSize: '14px' }}>
        Export, verify, and decode cryptographic proofs for your assets
      </p>

      {error && (
        <div style={{
          background: 'rgba(255, 68, 68, 0.1)',
          border: '1px solid rgba(255, 68, 68, 0.3)',
          borderRadius: '8px',
          padding: '12px',
          marginBottom: '20px',
          color: '#ff4444',
          fontSize: '14px'
        }}>
          ⚠️ {error}
        </div>
      )}

      {success && (
        <div style={{
          background: 'rgba(0, 255, 65, 0.1)',
          border: '1px solid rgba(0, 255, 65, 0.3)',
          borderRadius: '8px',
          padding: '12px',
          marginBottom: '20px',
          color: '#00ff41',
          fontSize: '14px'
        }}>
          {success}
        </div>
      )}

      {/* Export Proof */}
      <div style={{
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '12px',
        padding: '25px',
        marginBottom: '25px'
      }}>
        <h3 style={{ color: '#ffffff', marginBottom: '20px', fontSize: '18px' }}>
          📤 Export Proof
        </h3>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', color: '#a0a0a0', marginBottom: '8px', fontSize: '14px' }}>
            Select Asset
          </label>
          <select
            value={selectedAsset}
            onChange={(e) => setSelectedAsset(e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px',
              color: '#ffffff',
              fontSize: '14px'
            }}
          >
            <option value="">Choose an asset...</option>
            {groupedAssets.map(asset => (
              <option key={asset.asset_id} value={asset.asset_id}>
                {asset.asset_genesis?.name || 'Unnamed'} - {asset.asset_id?.substring(0, 16)}...
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={exportProof}
          disabled={loading || !selectedAsset}
          style={{
            width: '100%',
            background: !selectedAsset || loading ? 'rgba(255,255,255,0.1)' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: '#ffffff',
            border: 'none',
            padding: '14px',
            borderRadius: '8px',
            cursor: !selectedAsset || loading ? 'not-allowed' : 'pointer',
            fontSize: '15px',
            fontWeight: '600',
            opacity: loading ? 0.6 : 1
          }}
        >
          {loading ? '⏳ Exporting...' : '📤 Export Proof'}
        </button>

        {proofData && (
          <div style={{
            marginTop: '20px',
            background: 'rgba(0,0,0,0.3)',
            padding: '15px',
            borderRadius: '8px'
          }}>
            <div style={{ color: '#00ff41', fontSize: '14px', marginBottom: '10px', fontWeight: '600' }}>
              ✅ Proof Exported
            </div>
            <div style={{
              color: '#a0a0a0',
              fontSize: '12px',
              fontFamily: 'monospace',
              wordBreak: 'break-all',
              maxHeight: '150px',
              overflowY: 'auto'
            }}>
              {proofData.raw_proof_file?.substring(0, 200)}...
            </div>
            <div style={{ marginTop: '10px', color: '#a0a0a0', fontSize: '12px' }}>
              Genesis Point: {proofData.genesis_point}
            </div>
          </div>
        )}
      </div>

      {/* Verify & Decode */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '25px' }}>
        {/* Verify Proof */}
        <div style={{
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '12px',
          padding: '25px'
        }}>
          <h3 style={{ color: '#ffffff', marginBottom: '20px', fontSize: '18px' }}>
            ✅ Verify Proof
          </h3>

          <p style={{ color: '#a0a0a0', fontSize: '13px', marginBottom: '20px' }}>
            Cryptographically verify the exported proof
          </p>

          <button
            onClick={verifyProof}
            disabled={loading || !proofData}
            style={{
              width: '100%',
              background: !proofData || loading ? 'rgba(255,255,255,0.1)' : 'linear-gradient(135deg, #00ff41 0%, #00cc33 100%)',
              color: !proofData || loading ? '#a0a0a0' : '#000000',
              border: 'none',
              padding: '14px',
              borderRadius: '8px',
              cursor: !proofData || loading ? 'not-allowed' : 'pointer',
              fontSize: '15px',
              fontWeight: '600',
              opacity: loading ? 0.6 : 1,
              marginBottom: '15px'
            }}
          >
            {loading ? '⏳ Verifying...' : '✅ Verify Proof'}
          </button>

          {verificationResult && (
            <div style={{
              background: 'rgba(0, 255, 65, 0.1)',
              border: '1px solid rgba(0, 255, 65, 0.3)',
              padding: '15px',
              borderRadius: '8px'
            }}>
              <div style={{ color: '#00ff41', fontSize: '14px', fontWeight: '600', marginBottom: '10px' }}>
                ✅ Verification Result
              </div>
              <pre style={{
                color: '#00ff41',
                fontFamily: 'monospace',
                fontSize: '11px',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-all',
                margin: 0,
                maxHeight: '200px',
                overflowY: 'auto'
              }}>
                {JSON.stringify(verificationResult, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* Decode Proof */}
        <div style={{
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '12px',
          padding: '25px'
        }}>
          <h3 style={{ color: '#ffffff', marginBottom: '20px', fontSize: '18px' }}>
            🔍 Decode Proof
          </h3>

          <p style={{ color: '#a0a0a0', fontSize: '13px', marginBottom: '20px' }}>
            Decode the proof structure with witnesses
          </p>

          <button
            onClick={decodeProof}
            disabled={loading || !proofData}
            style={{
              width: '100%',
              background: !proofData || loading ? 'rgba(255,255,255,0.1)' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: '#ffffff',
              border: 'none',
              padding: '14px',
              borderRadius: '8px',
              cursor: !proofData || loading ? 'not-allowed' : 'pointer',
              fontSize: '15px',
              fontWeight: '600',
              opacity: loading ? 0.6 : 1,
              marginBottom: '15px'
            }}
          >
            {loading ? '⏳ Decoding...' : '🔍 Decode Proof'}
          </button>

          {decodedProof && (
            <div style={{
              background: 'rgba(0,0,0,0.3)',
              padding: '15px',
              borderRadius: '8px'
            }}>
              <div style={{ color: '#00ff41', fontSize: '14px', fontWeight: '600', marginBottom: '10px' }}>
                Decoded Proof
              </div>
              <pre style={{
                color: '#00ff41',
                fontFamily: 'monospace',
                fontSize: '11px',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-all',
                margin: 0,
                maxHeight: '200px',
                overflowY: 'auto'
              }}>
                {JSON.stringify(decodedProof, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>

      {/* Info Panel */}
      <div style={{
        background: 'rgba(102, 126, 234, 0.1)',
        border: '1px solid rgba(102, 126, 234, 0.3)',
        borderRadius: '12px',
        padding: '20px'
      }}>
        <h3 style={{ color: '#667eea', marginBottom: '15px', fontSize: '16px' }}>
          ℹ️ About Proofs
        </h3>
        <div style={{ color: '#a0a0a0', fontSize: '14px', lineHeight: '1.6' }}>
          <p style={{ marginBottom: '10px' }}>
            Taproot Assets uses cryptographic proofs to verify asset ownership and history:
          </p>
          <ul style={{ paddingLeft: '20px', margin: '10px 0' }}>
            <li><strong>Export:</strong> Extract the proof file for an asset you own</li>
            <li><strong>Verify:</strong> Cryptographically validate a proof's authenticity</li>
            <li><strong>Decode:</strong> Inspect the proof structure, witnesses, and metadata</li>
          </ul>
          <p style={{ marginTop: '10px' }}>
            Proofs are essential for trustless asset verification and can be shared with others to prove ownership.
          </p>
        </div>
      </div>
    </div>
  );
}
