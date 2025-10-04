import type { Asset } from '../lib/api';

interface AssetCardProps {
  asset: Asset;
  balance?: string;
}

export function AssetCard({ asset, balance }: AssetCardProps) {
  const name = asset.asset_genesis?.name || 'Unknown Asset';
  const assetId = asset.asset_id || asset.asset_genesis?.asset_id || 'N/A';
  const amount = balance || asset.amount || '0';

  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.05)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '12px',
      padding: '20px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
      marginBottom: '16px',
      transition: 'all 0.3s'
    }}>
      <h3 style={{ margin: '0 0 8px 0', color: '#ffffff' }}>
        {name}
      </h3>
      <p style={{ margin: '4px 0', color: '#a0a0a0', fontSize: '14px' }}>
        <strong style={{ color: '#ffffff' }}>Asset ID:</strong> {assetId.substring(0, 16)}...
      </p>
      <p style={{ margin: '8px 0', fontSize: '24px', fontWeight: 'bold', color: '#00ff41' }}>
        {parseInt(amount).toLocaleString()}
      </p>
    </div>
  );
}