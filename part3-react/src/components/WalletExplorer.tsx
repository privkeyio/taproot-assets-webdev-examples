import { useState } from 'react';
import { useTaprootAssets } from '../hooks/useTaprootAssets';

export function WalletExplorer() {
  const { assets } = useTaprootAssets();
  const [selectedAsset, setSelectedAsset] = useState('');
  const [keyFamily, setKeyFamily] = useState('1');
  const [generatedKey, setGeneratedKey] = useState<any>(null);
  const [ownershipProof, setOwnershipProof] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

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

  const generateInternalKey = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('http://localhost:8080/v1/taproot-assets/wallet/internal-key/next', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key_family: parseInt(keyFamily) })
      });

      if (!response.ok) throw new Error('Failed to generate key');

      const data = await response.json();
      setGeneratedKey({ type: 'Internal Key', ...data });
      setSuccess('Internal key generated successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate key');
    } finally {
      setLoading(false);
    }
  };

  const generateScriptKey = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('http://localhost:8080/v1/taproot-assets/wallet/script-key/next', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key_family: parseInt(keyFamily) })
      });

      if (!response.ok) throw new Error('Failed to generate key');

      const data = await response.json();
      setGeneratedKey({ type: 'Script Key', ...data });
      setSuccess('Script key generated successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate key');
    } finally {
      setLoading(false);
    }
  };

  const proveOwnership = async () => {
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

      const hexToBase64 = (hex: string): string => {
        const bytes = new Uint8Array(hex.match(/.{1,2}/g)?.map(byte => parseInt(byte, 16)) || []);
        return btoa(String.fromCharCode(...bytes));
      };

      const response = await fetch('http://localhost:8080/v1/taproot-assets/wallet/ownership/prove', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          asset_id: selectedAsset,
          script_key: scriptKey,
          outpoint: {
            txid: hexToBase64(outpoint[0]),
            output_index: parseInt(outpoint[1])
          },
          challenge: btoa('ownership_challenge_' + Date.now())
        })
      });

      if (!response.ok) throw new Error('Failed to prove ownership');

      const data = await response.json();
      setOwnershipProof(data);
      setSuccess('✅ Ownership proven successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to prove ownership');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <h2 style={{ color: '#ffffff', marginBottom: '10px', textAlign: 'center' }}>
        🔑 Wallet Explorer
      </h2>
      <p style={{ color: '#a0a0a0', textAlign: 'center', marginBottom: '15px', fontSize: '14px' }}>
        Generate keys and prove asset ownership
      </p>

      {/* Quick Start Instructions */}
      <div style={{
        background: 'rgba(102, 126, 234, 0.08)',
        border: '1px solid rgba(102, 126, 234, 0.25)',
        borderRadius: '10px',
        padding: '15px',
        marginBottom: '25px',
        fontSize: '13px',
        color: '#a0a0a0'
      }}>
        <div style={{ color: '#667eea', fontWeight: '600', marginBottom: '8px', fontSize: '14px' }}>
          🚀 Quick Start Guide
        </div>
        <ol style={{ margin: '0', paddingLeft: '20px', lineHeight: '1.6' }}>
          <li>Generate internal keys for HD wallet-based asset management</li>
          <li>Create script keys for use in asset script paths</li>
          <li>Select an asset and prove ownership with a cryptographic challenge</li>
          <li>All keys are derived from your wallet's master seed</li>
        </ol>
      </div>

      {error && (
        <div style={{
          background: 'rgba(255, 68, 68, 0.1)',
          border: '1px solid rgba(255, 68, 68, 0.3)',
          borderRadius: '8px',
          padding: '14px',
          marginBottom: '20px',
          color: '#ff4444',
          fontSize: '14px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <span style={{ fontSize: '18px' }}>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div style={{
          background: 'rgba(0, 255, 65, 0.1)',
          border: '1px solid rgba(0, 255, 65, 0.3)',
          borderRadius: '8px',
          padding: '14px',
          marginBottom: '20px',
          color: '#00ff41',
          fontSize: '14px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <span style={{ fontSize: '18px' }}>✅</span>
          <span>{success}</span>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '25px' }}>
        {/* Key Generation */}
        <div style={{
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '12px',
          padding: '25px'
        }}>
          <h3 style={{ color: '#ffffff', marginBottom: '20px', fontSize: '18px' }}>
            🔑 Generate Keys
          </h3>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', color: '#a0a0a0', marginBottom: '8px', fontSize: '14px' }}>
              Key Family
            </label>
            <input
              type="number"
              value={keyFamily}
              onChange={(e) => setKeyFamily(e.target.value)}
              min="0"
              style={{
                width: '100%',
                padding: '12px',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                color: '#ffffff',
                fontSize: '14px'
              }}
            />
          </div>

          <div style={{ display: 'grid', gap: '10px' }}>
            <button
              onClick={generateInternalKey}
              disabled={loading}
              style={{
                background: loading ? 'rgba(255,255,255,0.1)' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: '#ffffff',
                border: 'none',
                padding: '12px',
                borderRadius: '8px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                opacity: loading ? 0.6 : 1
              }}
            >
              {loading ? '⏳ Generating...' : '🔑 Generate Internal Key'}
            </button>

            <button
              onClick={generateScriptKey}
              disabled={loading}
              style={{
                background: loading ? 'rgba(255,255,255,0.1)' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: '#ffffff',
                border: 'none',
                padding: '12px',
                borderRadius: '8px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                opacity: loading ? 0.6 : 1
              }}
            >
              {loading ? '⏳ Generating...' : '📝 Generate Script Key'}
            </button>
          </div>

          {generatedKey && (
            <div style={{
              marginTop: '20px',
              background: 'rgba(0,0,0,0.3)',
              padding: '15px',
              borderRadius: '8px'
            }}>
              <div style={{ color: '#00ff41', fontSize: '14px', marginBottom: '10px', fontWeight: '600' }}>
                ✅ {generatedKey.type} Generated
              </div>
              <pre style={{
                color: '#00ff41',
                fontFamily: 'monospace',
                fontSize: '11px',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-all',
                margin: 0,
                maxHeight: '150px',
                overflowY: 'auto'
              }}>
                {JSON.stringify(generatedKey, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* Ownership Proof */}
        <div style={{
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '12px',
          padding: '25px'
        }}>
          <h3 style={{ color: '#ffffff', marginBottom: '20px', fontSize: '18px' }}>
            🛡️ Prove Ownership
          </h3>

          <p style={{ color: '#a0a0a0', fontSize: '13px', marginBottom: '20px' }}>
            Generate a cryptographic proof that you own an asset
          </p>

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
                  {asset.asset_genesis?.name || 'Unnamed'}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={proveOwnership}
            disabled={loading || !selectedAsset}
            style={{
              width: '100%',
              background: !selectedAsset || loading ? 'rgba(255,255,255,0.1)' : 'linear-gradient(135deg, #00ff41 0%, #00cc33 100%)',
              color: !selectedAsset || loading ? '#a0a0a0' : '#000000',
              border: 'none',
              padding: '14px',
              borderRadius: '8px',
              cursor: !selectedAsset || loading ? 'not-allowed' : 'pointer',
              fontSize: '15px',
              fontWeight: '600',
              opacity: loading ? 0.6 : 1,
              marginBottom: '15px'
            }}
          >
            {loading ? '⏳ Proving...' : '🛡️ Prove Ownership'}
          </button>

          {ownershipProof && (
            <div style={{
              background: 'rgba(0, 255, 65, 0.1)',
              border: '1px solid rgba(0, 255, 65, 0.3)',
              padding: '15px',
              borderRadius: '8px'
            }}>
              <div style={{ color: '#00ff41', fontSize: '14px', fontWeight: '600', marginBottom: '10px' }}>
                ✅ Ownership Proof
              </div>
              <pre style={{
                color: '#00ff41',
                fontFamily: 'monospace',
                fontSize: '11px',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-all',
                margin: 0,
                maxHeight: '150px',
                overflowY: 'auto'
              }}>
                {JSON.stringify(ownershipProof, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>

      {/* Info Panel */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.08) 0%, rgba(118, 75, 162, 0.08) 100%)',
        border: '1px solid rgba(102, 126, 234, 0.3)',
        borderRadius: '12px',
        padding: '25px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
          <span style={{ fontSize: '24px' }}>ℹ️</span>
          <h3 style={{ color: '#667eea', fontSize: '18px', margin: 0, fontWeight: '700' }}>
            About Wallet Operations
          </h3>
        </div>
        <div style={{ color: '#a0a0a0', fontSize: '14px', lineHeight: '1.7' }}>
          <p style={{ marginBottom: '15px', color: '#c0c0c0' }}>
            Wallet operations provide advanced key management and ownership verification:
          </p>
          <div style={{ display: 'grid', gap: '12px', marginBottom: '15px' }}>
            <div style={{
              background: 'rgba(102, 126, 234, 0.05)',
              padding: '12px 15px',
              borderRadius: '8px',
              border: '1px solid rgba(102, 126, 234, 0.15)'
            }}>
              <div style={{ color: '#667eea', fontWeight: '600', marginBottom: '4px', fontSize: '14px' }}>
                🔑 Internal Keys
              </div>
              <div style={{ fontSize: '13px' }}>
                HD wallet keys derived from your master seed for managing assets
              </div>
            </div>
            <div style={{
              background: 'rgba(118, 75, 162, 0.05)',
              padding: '12px 15px',
              borderRadius: '8px',
              border: '1px solid rgba(118, 75, 162, 0.15)'
            }}>
              <div style={{ color: '#764ba2', fontWeight: '600', marginBottom: '4px', fontSize: '14px' }}>
                📝 Script Keys
              </div>
              <div style={{ fontSize: '13px' }}>
                Specialized keys used in Taproot asset script paths and conditions
              </div>
            </div>
            <div style={{
              background: 'rgba(0, 255, 65, 0.05)',
              padding: '12px 15px',
              borderRadius: '8px',
              border: '1px solid rgba(0, 255, 65, 0.15)'
            }}>
              <div style={{ color: '#00ff41', fontWeight: '600', marginBottom: '4px', fontSize: '14px' }}>
                🛡️ Ownership Proofs
              </div>
              <div style={{ fontSize: '13px' }}>
                Cryptographic signatures proving you control specific assets without revealing private keys
              </div>
            </div>
          </div>
          <div style={{
            background: 'rgba(0,0,0,0.3)',
            padding: '12px 15px',
            borderRadius: '8px',
            fontSize: '13px',
            color: '#b0b0b0',
            lineHeight: '1.6'
          }}>
            <strong style={{ color: '#667eea' }}>💡 Pro Tip:</strong> All keys are deterministically derived from your wallet seed, ensuring backup and recovery capabilities while maintaining security.
          </div>
        </div>
      </div>
    </div>
  );
}
