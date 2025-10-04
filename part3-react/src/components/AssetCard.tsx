import type { Asset } from '../lib/api';
import { useState } from 'react';

interface AssetCardProps {
  asset: Asset;
  balance?: string;
  utxoCount?: number;
}

export function AssetCard({ asset, balance, utxoCount = 1 }: AssetCardProps) {
  const [expanded, setExpanded] = useState(false);

  const name = asset.asset_genesis?.name || 'Unknown Asset';
  const assetId = asset.asset_id || asset.asset_genesis?.asset_id || 'N/A';
  const amount = balance || asset.amount || '0';
  const assetType = asset.asset_genesis?.asset_type || asset.asset_type || 'NORMAL';
  const decimals = asset.decimal_display?.decimal_display || 0;
  const genesisHeight = asset.chain_anchor?.block_height || 0;
  const metaHash = asset.asset_genesis?.meta_hash || 'None';
  const scriptKey = asset.script_key || 'N/A';

  // Format balance with decimals
  const formatBalance = (bal: string, dec: number) => {
    const num = parseInt(bal);
    const divisor = Math.pow(10, dec);
    const adjustedNum = num / divisor;
    return adjustedNum.toLocaleString(undefined, {
      minimumFractionDigits: dec > 0 ? 2 : 0,
      maximumFractionDigits: dec > 0 ? 2 : 0
    });
  };

  const truncateId = (id: string, length = 16) => {
    if (!id || id.length <= length) return id;
    return id.substring(0, length / 2) + '...' + id.substring(id.length - length / 2);
  };

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, rgba(26, 26, 46, 0.9) 0%, rgba(40, 40, 70, 0.9) 100%)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        borderRadius: '20px',
        padding: '28px',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden'
      }}
      onClick={() => setExpanded(!expanded)}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 12px 32px rgba(102, 126, 234, 0.3)';
        e.currentTarget.style.borderColor = 'rgba(102, 126, 234, 0.5)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.4)';
        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
      }}
    >
      {/* Gradient overlay */}
      <div style={{
        position: 'absolute',
        top: 0,
        right: 0,
        width: '150px',
        height: '150px',
        background: 'radial-gradient(circle, rgba(102, 126, 234, 0.1) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />

      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '20px',
        paddingBottom: '20px',
        borderBottom: '2px solid rgba(255, 255, 255, 0.1)',
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
            <span style={{ fontSize: '32px', filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.3))' }}>
              {assetType === 'COLLECTIBLE' ? '🎨' : '💰'}
            </span>
            <h3 style={{
              margin: 0,
              color: '#ffffff',
              fontSize: '22px',
              fontWeight: '700',
              letterSpacing: '0.5px'
            }}>
              {name}
            </h3>
          </div>
          <div style={{
            display: 'inline-block',
            padding: '6px 14px',
            background: assetType === 'COLLECTIBLE'
              ? 'rgba(240, 147, 251, 0.2)'
              : 'rgba(102, 126, 234, 0.2)',
            border: assetType === 'COLLECTIBLE'
              ? '1px solid rgba(240, 147, 251, 0.4)'
              : '1px solid rgba(102, 126, 234, 0.4)',
            borderRadius: '20px',
            fontSize: '11px',
            fontWeight: '700',
            color: assetType === 'COLLECTIBLE' ? '#f093fb' : '#667eea',
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}>
            {assetType === 'COLLECTIBLE' ? 'Collectible NFT' : 'Fungible Token'}
          </div>
        </div>
      </div>

      {/* Balance Display */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(0, 255, 65, 0.05) 0%, rgba(0, 200, 50, 0.05) 100%)',
        borderRadius: '16px',
        padding: '20px',
        marginBottom: '20px',
        border: '1px solid rgba(0, 255, 65, 0.2)',
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{
          color: '#a0a0a0',
          fontSize: '12px',
          fontWeight: '600',
          textTransform: 'uppercase',
          letterSpacing: '1.5px',
          marginBottom: '8px'
        }}>Total Balance</div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
          <div style={{
            fontSize: '42px',
            fontWeight: '900',
            color: '#00ff41',
            textShadow: '0 0 20px rgba(0, 255, 65, 0.4)',
            lineHeight: 1
          }}>
            {formatBalance(amount, decimals)}
          </div>
          <div style={{
            color: '#a0a0a0',
            fontSize: '16px',
            fontWeight: '600'
          }}>
            {name}
          </div>
        </div>
      </div>

      {/* Asset Details Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '12px',
        marginBottom: '16px',
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{
          background: 'rgba(0, 0, 0, 0.3)',
          padding: '14px',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.05)'
        }}>
          <div style={{ color: '#a0a0a0', fontSize: '11px', fontWeight: '600', marginBottom: '6px' }}>UTXOs</div>
          <div style={{ color: '#ffffff', fontSize: '20px', fontWeight: '700' }}>{utxoCount}</div>
        </div>

        <div style={{
          background: 'rgba(0, 0, 0, 0.3)',
          padding: '14px',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.05)'
        }}>
          <div style={{ color: '#a0a0a0', fontSize: '11px', fontWeight: '600', marginBottom: '6px' }}>Genesis Block</div>
          <div style={{ color: '#ffffff', fontSize: '20px', fontWeight: '700' }}>
            {genesisHeight > 0 ? genesisHeight.toLocaleString() : 'Pending'}
          </div>
        </div>

        <div style={{
          background: 'rgba(0, 0, 0, 0.3)',
          padding: '14px',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.05)'
        }}>
          <div style={{ color: '#a0a0a0', fontSize: '11px', fontWeight: '600', marginBottom: '6px' }}>Decimals</div>
          <div style={{ color: '#ffffff', fontSize: '20px', fontWeight: '700' }}>{decimals}</div>
        </div>

        <div style={{
          background: 'rgba(0, 0, 0, 0.3)',
          padding: '14px',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.05)'
        }}>
          <div style={{ color: '#a0a0a0', fontSize: '11px', fontWeight: '600', marginBottom: '6px' }}>Type</div>
          <div style={{ color: '#ffffff', fontSize: '14px', fontWeight: '700', textTransform: 'uppercase' }}>
            {assetType}
          </div>
        </div>
      </div>

      {/* Asset ID */}
      <div style={{
        background: 'rgba(0, 0, 0, 0.4)',
        borderRadius: '12px',
        padding: '14px',
        marginBottom: expanded ? '16px' : '0',
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{
          color: '#a0a0a0',
          fontSize: '11px',
          fontWeight: '600',
          textTransform: 'uppercase',
          letterSpacing: '1px',
          marginBottom: '8px'
        }}>Asset ID</div>
        <div style={{
          color: '#00ff41',
          fontSize: '12px',
          fontFamily: 'monospace',
          wordBreak: 'break-all',
          textShadow: '0 0 10px rgba(0, 255, 65, 0.2)',
          lineHeight: 1.4
        }}>
          {expanded ? assetId : truncateId(assetId, 24)}
        </div>
      </div>

      {/* Expanded Details */}
      {expanded && (
        <div style={{
          borderTop: '2px solid rgba(255, 255, 255, 0.1)',
          paddingTop: '20px',
          marginTop: '20px',
          animation: 'fadeIn 0.3s ease-out',
          position: 'relative',
          zIndex: 1
        }}>
          <div style={{ marginBottom: '12px' }}>
            <div style={{ color: '#a0a0a0', fontSize: '11px', fontWeight: '600', marginBottom: '6px' }}>Meta Hash</div>
            <div style={{
              color: '#ffffff',
              fontSize: '11px',
              fontFamily: 'monospace',
              wordBreak: 'break-all',
              background: 'rgba(0, 0, 0, 0.3)',
              padding: '10px',
              borderRadius: '8px'
            }}>
              {metaHash}
            </div>
          </div>

          <div>
            <div style={{ color: '#a0a0a0', fontSize: '11px', fontWeight: '600', marginBottom: '6px' }}>Script Key</div>
            <div style={{
              color: '#ffffff',
              fontSize: '11px',
              fontFamily: 'monospace',
              wordBreak: 'break-all',
              background: 'rgba(0, 0, 0, 0.3)',
              padding: '10px',
              borderRadius: '8px'
            }}>
              {scriptKey.length > 32 ? truncateId(scriptKey, 32) : scriptKey}
            </div>
          </div>
        </div>
      )}

      {/* Expand Indicator */}
      <div style={{
        textAlign: 'center',
        marginTop: '16px',
        color: '#667eea',
        fontSize: '12px',
        fontWeight: '600',
        position: 'relative',
        zIndex: 1
      }}>
        {expanded ? '▲ Click to collapse' : '▼ Click for more details'}
      </div>
    </div>
  );
}