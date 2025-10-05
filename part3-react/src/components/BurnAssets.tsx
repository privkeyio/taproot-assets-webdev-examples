import { useState } from 'react';
import { useBurn } from '../hooks/useBurn';
import { useTaprootAssets } from '../hooks/useTaprootAssets';

export function BurnAssets() {
  const { burns, burnAsset, refresh } = useBurn();
  const { assets } = useTaprootAssets();
  const [selectedAsset, setSelectedAsset] = useState('');
  const [amountToBurn, setAmountToBurn] = useState('');
  const [note, setNote] = useState('');
  const [confirmText, setConfirmText] = useState('');
  const [burning, setBurning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Group assets by asset_id
  const groupedAssets = (() => {
    const map = new Map();
    assets.forEach((asset) => {
      const assetId = asset.asset_id || asset.asset_genesis?.asset_id || '';
      if (!map.has(assetId)) {
        const totalAmount = assets
          .filter(a => (a.asset_id || a.asset_genesis?.asset_id) === assetId)
          .reduce((sum, a) => sum + parseInt(a.amount || '0'), 0);
        map.set(assetId, { ...asset, totalAmount });
      }
    });
    return Array.from(map.values());
  })();

  const selectedAssetData = groupedAssets.find(a => a.asset_id === selectedAsset);
  const maxAmount = selectedAssetData?.totalAmount || 0;

  const handleBurn = async () => {
    if (!selectedAsset || !amountToBurn) {
      setError('Please select an asset and enter an amount');
      return;
    }

    if (confirmText !== 'BURN') {
      setError('Please type BURN to confirm');
      return;
    }

    const amount = parseInt(amountToBurn);
    if (amount <= 0 || amount > maxAmount) {
      setError(`Amount must be between 1 and ${maxAmount}`);
      return;
    }

    try {
      setBurning(true);
      setError(null);
      setSuccess(false);

      await burnAsset(selectedAsset, amountToBurn, note || undefined);

      // Reset form
      setSelectedAsset('');
      setAmountToBurn('');
      setNote('');
      setConfirmText('');
      setSuccess(true);

      // Refresh burns list
      setTimeout(refresh, 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Burn failed');
    } finally {
      setBurning(false);
    }
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <h2 style={{ color: '#ffffff', marginBottom: '10px', textAlign: 'center' }}>
        🔥 Burn Assets
      </h2>
      <p style={{ color: '#a0a0a0', textAlign: 'center', marginBottom: '15px', fontSize: '14px' }}>
        Permanently destroy assets - this action cannot be undone
      </p>

      {/* Info Panel */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.08) 0%, rgba(118, 75, 162, 0.08) 100%)',
        border: '1px solid rgba(102, 126, 234, 0.3)',
        borderRadius: '12px',
        padding: '25px',
        marginBottom: '25px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
          <span style={{ fontSize: '24px' }}>ℹ️</span>
          <h3 style={{ color: '#667eea', fontSize: '18px', margin: 0, fontWeight: '700' }}>
            About Burning Assets
          </h3>
        </div>
        <div style={{ color: '#a0a0a0', fontSize: '14px', lineHeight: '1.7' }}>
          <p style={{ marginBottom: '15px', color: '#c0c0c0' }}>
            Burning assets permanently removes them from circulation. This is useful for:
          </p>
          <div style={{ display: 'grid', gap: '12px', marginBottom: '15px' }}>
            <div style={{
              background: 'rgba(255, 68, 68, 0.05)',
              padding: '12px 15px',
              borderRadius: '8px',
              border: '1px solid rgba(255, 68, 68, 0.15)'
            }}>
              <div style={{ color: '#ff4444', fontWeight: '600', marginBottom: '4px', fontSize: '14px' }}>
                📉 Supply Reduction
              </div>
              <div style={{ fontSize: '13px' }}>
                Decrease total supply to create scarcity and deflationary pressure
              </div>
            </div>
            <div style={{
              background: 'rgba(102, 126, 234, 0.05)',
              padding: '12px 15px',
              borderRadius: '8px',
              border: '1px solid rgba(102, 126, 234, 0.15)'
            }}>
              <div style={{ color: '#667eea', fontWeight: '600', marginBottom: '4px', fontSize: '14px' }}>
                🧹 Asset Cleanup
              </div>
              <div style={{ fontSize: '13px' }}>
                Remove test assets, mistakes, or unwanted tokens from your wallet
              </div>
            </div>
          </div>
          <div style={{
            background: 'rgba(255, 68, 68, 0.15)',
            padding: '12px 15px',
            borderRadius: '8px',
            fontSize: '13px',
            color: '#ff4444',
            lineHeight: '1.6',
            border: '1px solid rgba(255, 68, 68, 0.3)'
          }}>
            <strong>⚠️ Warning:</strong> Burned assets are gone forever and cannot be recovered. This action is irreversible and permanent.
          </div>
        </div>
      </div>

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
          <li>Select the asset you want to burn from your wallet</li>
          <li>Enter the amount to permanently destroy</li>
          <li>Optionally add a note explaining why you're burning the assets</li>
          <li>Type "BURN" to confirm this irreversible action</li>
          <li>View burn history to see all destroyed assets</li>
        </ol>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginBottom: '30px' }}>
        {/* Burn Form */}
        <div style={{
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '12px',
          padding: '25px'
        }}>
          <h3 style={{ color: '#ffffff', marginBottom: '20px', fontSize: '18px' }}>
            Burn Asset
          </h3>

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
              <span>Assets burned successfully!</span>
            </div>
          )}

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
                  {asset.asset_genesis?.name || 'Unnamed'} ({asset.totalAmount} units)
                </option>
              ))}
            </select>
          </div>

          {selectedAsset && (
            <>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', color: '#a0a0a0', marginBottom: '8px', fontSize: '14px' }}>
                  Amount to Burn (max: {maxAmount})
                </label>
                <input
                  type="number"
                  value={amountToBurn}
                  onChange={(e) => setAmountToBurn(e.target.value)}
                  max={maxAmount}
                  min="1"
                  placeholder={`1 - ${maxAmount}`}
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

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', color: '#a0a0a0', marginBottom: '8px', fontSize: '14px' }}>
                  Note (optional)
                </label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Reason for burning..."
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    color: '#ffffff',
                    fontSize: '14px',
                    resize: 'vertical'
                  }}
                />
              </div>

              <div style={{ marginBottom: '25px' }}>
                <label style={{ display: 'block', color: '#a0a0a0', marginBottom: '8px', fontSize: '14px' }}>
                  Type "BURN" to confirm
                </label>
                <input
                  type="text"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  placeholder="BURN"
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: 'rgba(255,255,255,0.05)',
                    border: `1px solid ${confirmText === 'BURN' ? 'rgba(255, 68, 68, 0.5)' : 'rgba(255,255,255,0.1)'}`,
                    borderRadius: '8px',
                    color: confirmText === 'BURN' ? '#ff4444' : '#ffffff',
                    fontSize: '14px',
                    fontWeight: confirmText === 'BURN' ? '600' : 'normal'
                  }}
                />
              </div>

              <button
                onClick={handleBurn}
                disabled={burning || !selectedAsset || !amountToBurn || confirmText !== 'BURN'}
                style={{
                  width: '100%',
                  background: confirmText === 'BURN' && selectedAsset && amountToBurn ? 'linear-gradient(135deg, #ff4444 0%, #cc0000 100%)' : 'rgba(255,255,255,0.1)',
                  color: '#ffffff',
                  border: 'none',
                  padding: '16px',
                  borderRadius: '8px',
                  cursor: confirmText === 'BURN' && selectedAsset && amountToBurn && !burning ? 'pointer' : 'not-allowed',
                  fontSize: '16px',
                  fontWeight: '600',
                  opacity: burning ? 0.6 : 1,
                  transition: 'all 0.3s'
                }}
              >
                {burning ? '🔥 Burning...' : '🔥 Burn Assets Forever'}
              </button>

              <div style={{
                marginTop: '15px',
                padding: '12px',
                background: 'rgba(255, 68, 68, 0.1)',
                border: '1px solid rgba(255, 68, 68, 0.2)',
                borderRadius: '8px',
                fontSize: '12px',
                color: '#ff4444'
              }}>
                ⚠️ <strong>Warning:</strong> This action is irreversible. Burned assets cannot be recovered.
              </div>
            </>
          )}
        </div>

        {/* Burn History */}
        <div style={{
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '12px',
          padding: '25px'
        }}>
          <h3 style={{ color: '#ffffff', marginBottom: '20px', fontSize: '18px' }}>
            🔥 Burn History
          </h3>

          {burns.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '50px 20px',
              background: 'rgba(255, 68, 68, 0.05)',
              borderRadius: '12px',
              border: '1px solid rgba(255, 68, 68, 0.2)'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '12px', opacity: 0.6 }}>🔥</div>
              <div style={{ color: '#ff4444', fontSize: '16px', marginBottom: '8px', fontWeight: '600' }}>
                No Burn History
              </div>
              <div style={{ color: '#a0a0a0', fontSize: '13px' }}>
                Burned assets will appear here
              </div>
            </div>
          ) : (
            <div style={{
              maxHeight: '500px',
              overflowY: 'auto',
              display: 'grid',
              gap: '12px',
              paddingRight: '5px'
            }}>
              {burns.map((burn, index) => (
                <div
                  key={index}
                  style={{
                    background: 'rgba(0,0,0,0.3)',
                    border: '1px solid rgba(255, 68, 68, 0.2)',
                    borderRadius: '8px',
                    padding: '15px'
                  }}
                >
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '12px'
                  }}>
                    <div>
                      <div style={{ color: '#ffffff', fontSize: '14px', fontWeight: '600', marginBottom: '5px' }}>
                        Asset Burned
                      </div>
                      <div style={{
                        color: '#a0a0a0',
                        fontSize: '11px',
                        fontFamily: 'monospace',
                        wordBreak: 'break-all'
                      }}>
                        {burn.asset_id?.substring(0, 24)}...
                      </div>
                    </div>
                    <div style={{
                      background: 'rgba(255, 68, 68, 0.2)',
                      color: '#ff4444',
                      padding: '4px 10px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '600'
                    }}>
                      🔥 Burned
                    </div>
                  </div>

                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    paddingTop: '12px',
                    borderTop: '1px solid rgba(255,255,255,0.1)'
                  }}>
                    <span style={{ color: '#a0a0a0', fontSize: '12px' }}>Amount</span>
                    <span style={{ color: '#ff4444', fontSize: '13px', fontWeight: '600' }}>
                      {burn.amount} units
                    </span>
                  </div>

                  {burn.anchor_txid && (
                    <div style={{
                      marginTop: '10px',
                      padding: '8px',
                      background: 'rgba(0,0,0,0.2)',
                      borderRadius: '4px'
                    }}>
                      <div style={{ color: '#a0a0a0', fontSize: '10px', marginBottom: '4px' }}>TX ID</div>
                      <div style={{
                        color: '#00ff41',
                        fontSize: '11px',
                        fontFamily: 'monospace',
                        wordBreak: 'break-all'
                      }}>
                        {burn.anchor_txid}
                      </div>
                    </div>
                  )}

                  {burn.note && (
                    <div style={{
                      marginTop: '10px',
                      color: '#a0a0a0',
                      fontSize: '11px',
                      fontStyle: 'italic'
                    }}>
                      "{burn.note}"
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
