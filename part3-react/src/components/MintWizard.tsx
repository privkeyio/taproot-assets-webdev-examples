import { useState } from 'react';
import { useMintBatches } from '../hooks/useMintBatches';

export function MintWizard() {
  const { batches, mintAsset, fundBatch, finalizeBatch, cancelBatch, refresh } = useMintBatches();
  const [step, setStep] = useState<'create' | 'finalize'>('create');

  // Form state
  const [assetType, setAssetType] = useState<'NORMAL' | 'COLLECTIBLE'>('NORMAL');
  const [assetName, setAssetName] = useState('');
  const [amount, setAmount] = useState('');
  const [metadata, setMetadata] = useState('');
  const [feeRate, setFeeRate] = useState('1000');
  const [minting, setMinting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pendingBatch = batches.find(b => b.state === 'BATCH_STATE_PENDING' || b.state === 'BATCH_STATE_FROZEN');
  const fundedBatch = batches.find(b => b.state === 'BATCH_STATE_FUNDED' || b.batch_psbt);
  const finalizedBatches = batches.filter(b => b.state === 'BATCH_STATE_FINALIZED' || b.state === 'BATCH_STATE_BROADCAST' || b.state === 'BATCH_STATE_CONFIRMED');

  // If we just created an asset but batch list is empty, we need to fund/finalize
  const hasPendingMint = step === 'pending' || step === 'complete';

  const handleMint = async () => {
    if (!assetName.trim()) {
      setError('Asset name is required');
      return;
    }

    if (assetType === 'NORMAL' && (!amount || parseInt(amount) <= 0)) {
      setError('Amount must be greater than 0 for normal assets');
      return;
    }

    try {
      setMinting(true);
      setError(null);
      await mintAsset(assetType, assetName, amount, metadata || undefined);

      // Move to finalize step
      setStep('finalize');

      // Refresh batches
      setTimeout(refresh, 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Minting failed');
    } finally {
      setMinting(false);
    }
  };

  const handleFund = async () => {
    try {
      setMinting(true);
      setError(null);
      // Fund batch - batch_key is optional, API will use current pending batch
      await fundBatch('', parseInt(feeRate));
      // Move to finalize step after successful funding
      setStep('complete');
      setTimeout(refresh, 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Funding failed');
    } finally {
      setMinting(false);
    }
  };

  const handleFinalize = async () => {
    try {
      console.log('[MintWizard] Starting finalization...');
      setMinting(true);
      setError(null);

      // Refresh batches first to get latest state
      await refresh();

      const result = await finalizeBatch(parseInt(feeRate));
      console.log('[MintWizard] Finalization successful:', result);

      // Show success message before resetting
      alert('✅ Asset minted successfully! Transaction broadcast to network. Wait ~30 seconds for confirmation.');

      // Reset form and go back to create
      setAssetName('');
      setAmount('');
      setMetadata('');
      setStep('create');
      setTimeout(refresh, 1000);
    } catch (err) {
      console.error('[MintWizard] Finalization error:', err);
      setError(err instanceof Error ? err.message : 'Finalization failed');
    } finally {
      setMinting(false);
    }
  };

  const handleCancel = async () => {
    try {
      setMinting(true);
      setError(null);
      await cancelBatch();
      setStep('create');
      setTimeout(refresh, 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Cancellation failed');
    } finally {
      setMinting(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h2 style={{ color: '#ffffff', marginBottom: '10px', textAlign: 'center' }}>
        🪙 Asset Minting Wizard
      </h2>
      <p style={{ color: '#a0a0a0', textAlign: 'center', marginBottom: '15px', fontSize: '14px' }}>
        Create and mint custom Taproot Assets on Bitcoin
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
          <li>Choose asset type: Normal (fungible tokens) or Collectible (NFT)</li>
          <li>Enter asset name and amount (for normal assets)</li>
          <li>Optionally add metadata to describe your asset</li>
          <li>Create the asset, then finalize and broadcast to the Bitcoin network</li>
          <li>Wait ~30 seconds for confirmation</li>
        </ol>
      </div>

      {/* Progress Steps */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '40px', position: 'relative' }}>
        <div style={{ position: 'absolute', top: '20px', left: '0', right: '0', height: '2px', background: 'rgba(255,255,255,0.1)' }} />

        {['create', 'finalize'].map((s, i) => (
          <div key={s} style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            position: 'relative',
            zIndex: 1
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: step === s ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'rgba(255,255,255,0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontWeight: 'bold',
              marginBottom: '10px'
            }}>
              {i + 1}
            </div>
            <div style={{ color: step === s ? '#ffffff' : '#a0a0a0', fontSize: '14px', textAlign: 'center' }}>
              {s === 'create' && 'Create Asset'}
              {s === 'finalize' && 'Finalize & Broadcast'}
            </div>
          </div>
        ))}
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

      {/* Step 1: Create Asset */}
      {step === 'create' && (
        <div style={{
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '12px',
          padding: '30px'
        }}>
          <h3 style={{ color: '#ffffff', marginBottom: '20px', fontSize: '18px' }}>
            🎨 Create New Asset
          </h3>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', color: '#a0a0a0', marginBottom: '8px', fontSize: '14px' }}>
              Asset Type
            </label>
            <div style={{ display: 'flex', gap: '15px' }}>
              <button
                onClick={() => setAssetType('NORMAL')}
                style={{
                  flex: 1,
                  background: assetType === 'NORMAL' ? 'rgba(102, 126, 234, 0.3)' : 'rgba(255,255,255,0.05)',
                  border: `2px solid ${assetType === 'NORMAL' ? '#667eea' : 'rgba(255,255,255,0.1)'}`,
                  borderRadius: '8px',
                  padding: '15px',
                  color: '#ffffff',
                  cursor: 'pointer',
                  transition: 'all 0.3s'
                }}
              >
                <div style={{ fontSize: '24px', marginBottom: '5px' }}>💰</div>
                <div style={{ fontWeight: '600' }}>Normal</div>
                <div style={{ fontSize: '12px', color: '#a0a0a0', marginTop: '5px' }}>Fungible tokens</div>
              </button>
              <button
                onClick={() => setAssetType('COLLECTIBLE')}
                style={{
                  flex: 1,
                  background: assetType === 'COLLECTIBLE' ? 'rgba(102, 126, 234, 0.3)' : 'rgba(255,255,255,0.05)',
                  border: `2px solid ${assetType === 'COLLECTIBLE' ? '#667eea' : 'rgba(255,255,255,0.1)'}`,
                  borderRadius: '8px',
                  padding: '15px',
                  color: '#ffffff',
                  cursor: 'pointer',
                  transition: 'all 0.3s'
                }}
              >
                <div style={{ fontSize: '24px', marginBottom: '5px' }}>🎨</div>
                <div style={{ fontWeight: '600' }}>Collectible</div>
                <div style={{ fontSize: '12px', color: '#a0a0a0', marginTop: '5px' }}>NFT (1 of 1)</div>
              </button>
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', color: '#a0a0a0', marginBottom: '8px', fontSize: '14px' }}>
              Asset Name *
            </label>
            <input
              type="text"
              value={assetName}
              onChange={(e) => setAssetName(e.target.value)}
              placeholder="e.g., MyToken, CoolNFT"
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

          {assetType === 'NORMAL' && (
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', color: '#a0a0a0', marginBottom: '8px', fontSize: '14px' }}>
                Amount *
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Total supply"
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
          )}

          <div style={{ marginBottom: '30px' }}>
            <label style={{ display: 'block', color: '#a0a0a0', marginBottom: '8px', fontSize: '14px' }}>
              Metadata (optional)
            </label>
            <textarea
              value={metadata}
              onChange={(e) => setMetadata(e.target.value)}
              placeholder="JSON metadata, description, or any text..."
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

          <button
            onClick={handleMint}
            disabled={minting || !assetName}
            style={{
              width: '100%',
              background: !assetName || minting ? 'rgba(255,255,255,0.1)' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: '#ffffff',
              border: 'none',
              padding: '16px',
              borderRadius: '8px',
              cursor: !assetName || minting ? 'not-allowed' : 'pointer',
              fontSize: '16px',
              fontWeight: '600',
              opacity: minting ? 0.6 : 1
            }}
          >
            {minting ? '⏳ Creating Asset...' : '🚀 Create Asset'}
          </button>
        </div>
      )}

      {/* Step 2: Finalize - Broadcast the transaction */}
      {step === 'finalize' && (
        <div style={{
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '12px',
          padding: '30px'
        }}>
          <h3 style={{ color: '#ffffff', marginBottom: '20px', fontSize: '18px' }}>
            🎉 Finalize & Broadcast
          </h3>

          <div style={{
            background: 'rgba(0, 255, 65, 0.08)',
            border: '1px solid rgba(0, 255, 65, 0.25)',
            padding: '20px',
            borderRadius: '10px',
            marginBottom: '20px'
          }}>
            <div style={{ color: '#00ff41', fontSize: '16px', marginBottom: '10px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '20px' }}>✅</span>
              <span>Asset Created Successfully</span>
            </div>
            <div style={{ color: '#a0a0a0', fontSize: '14px', lineHeight: '1.6' }}>
              Ready to finalize! This will fund and broadcast the transaction to mint your asset on the Bitcoin network.
            </div>

            {pendingBatch && (
              <div style={{ marginTop: '15px' }}>
                <div style={{ color: '#a0a0a0', fontSize: '12px', marginBottom: '5px' }}>
                  Batch Key
                </div>
                <div style={{
                  color: '#00ff41',
                  fontFamily: 'monospace',
                  fontSize: '11px',
                  wordBreak: 'break-all'
                }}>
                  {pendingBatch.batch_key}
                </div>
              </div>
            )}
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', color: '#a0a0a0', marginBottom: '8px', fontSize: '14px' }}>
              Fee Rate (sat/kw) - Minimum: 253
            </label>
            <input
              type="number"
              value={feeRate}
              onChange={(e) => setFeeRate(e.target.value)}
              min="253"
              placeholder="1000"
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
            <div style={{ fontSize: '11px', color: '#a0a0a0', marginTop: '5px' }}>
              Recommended: 1000+ sat/kw for reliable confirmation
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
            <button
              onClick={handleCancel}
              disabled={minting}
              style={{
                background: 'rgba(255, 68, 68, 0.2)',
                color: '#ff4444',
                border: '1px solid rgba(255, 68, 68, 0.3)',
                padding: '14px',
                borderRadius: '8px',
                cursor: minting ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                opacity: minting ? 0.6 : 1
              }}
            >
              ❌ Cancel
            </button>
            <button
              onClick={handleFinalize}
              disabled={minting}
              style={{
                background: minting ? 'rgba(255,255,255,0.1)' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: '#ffffff',
                border: 'none',
                padding: '14px',
                borderRadius: '8px',
                cursor: minting ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                opacity: minting ? 0.6 : 1
              }}
            >
              {minting ? '⏳ Finalizing...' : '🎉 Finalize & Broadcast'}
            </button>
          </div>

          <div style={{
            marginTop: '20px',
            padding: '12px 15px',
            background: 'rgba(0,0,0,0.3)',
            borderRadius: '8px',
            fontSize: '13px',
            color: '#b0b0b0',
            lineHeight: '1.6'
          }}>
            <strong style={{ color: '#667eea' }}>💡 Pro Tip:</strong> This will fund the batch, create the on-chain transaction, and broadcast it to the network in one step. Wait ~30 seconds for confirmation.
          </div>
        </div>
      )}

      {/* Info Panel */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.08) 0%, rgba(118, 75, 162, 0.08) 100%)',
        border: '1px solid rgba(102, 126, 234, 0.3)',
        borderRadius: '12px',
        padding: '25px',
        marginTop: '25px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
          <span style={{ fontSize: '24px' }}>ℹ️</span>
          <h3 style={{ color: '#667eea', fontSize: '18px', margin: 0, fontWeight: '700' }}>
            About Asset Minting
          </h3>
        </div>
        <div style={{ color: '#a0a0a0', fontSize: '14px', lineHeight: '1.7' }}>
          <p style={{ marginBottom: '15px', color: '#c0c0c0' }}>
            The minting process creates new Taproot Assets anchored to Bitcoin transactions:
          </p>
          <div style={{ display: 'grid', gap: '12px', marginBottom: '15px' }}>
            <div style={{
              background: 'rgba(102, 126, 234, 0.05)',
              padding: '12px 15px',
              borderRadius: '8px',
              border: '1px solid rgba(102, 126, 234, 0.15)'
            }}>
              <div style={{ color: '#667eea', fontWeight: '600', marginBottom: '4px', fontSize: '14px' }}>
                💰 Normal Assets
              </div>
              <div style={{ fontSize: '13px' }}>
                Fungible tokens with a defined supply, perfect for currencies or points
              </div>
            </div>
            <div style={{
              background: 'rgba(118, 75, 162, 0.05)',
              padding: '12px 15px',
              borderRadius: '8px',
              border: '1px solid rgba(118, 75, 162, 0.15)'
            }}>
              <div style={{ color: '#764ba2', fontWeight: '600', marginBottom: '4px', fontSize: '14px' }}>
                🎨 Collectibles
              </div>
              <div style={{ fontSize: '13px' }}>
                Non-fungible tokens (NFTs) with a supply of 1, ideal for unique items
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
            <strong style={{ color: '#667eea' }}>💡 Pro Tip:</strong> The two-step process (create + finalize) gives you time to review before committing to the Bitcoin blockchain.
            Once finalized, the asset is permanently recorded.
          </div>
        </div>
      </div>
    </div>
  );
}
