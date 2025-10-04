import { useState } from 'react';
import { useTaprootAssets } from '../hooks/useTaprootAssets';

export function RFQMarket() {
  const { assets } = useTaprootAssets();
  const [selectedAsset, setSelectedAsset] = useState('');
  const [maxUnits, setMaxUnits] = useState('1000');
  const [quotes, setQuotes] = useState<any>(null);
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

  const createBuyOffer = async () => {
    if (!selectedAsset) {
      setError('Please select an asset');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`http://localhost:8080/v1/taproot-assets/rfq/buyoffer/asset-id/${selectedAsset}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          asset_specifier: { asset_id_str: selectedAsset },
          max_units: maxUnits
        })
      });

      if (!response.ok) throw new Error('Failed to create buy offer');

      const data = await response.json();
      setSuccess('Buy offer created successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create buy offer');
    } finally {
      setLoading(false);
    }
  };

  const createSellOffer = async () => {
    if (!selectedAsset) {
      setError('Please select an asset');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`http://localhost:8080/v1/taproot-assets/rfq/selloffer/asset-id/${selectedAsset}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          asset_specifier: { asset_id_str: selectedAsset },
          max_units: maxUnits
        })
      });

      if (!response.ok) throw new Error('Failed to create sell offer');

      const data = await response.json();
      setSuccess('Sell offer created successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create sell offer');
    } finally {
      setLoading(false);
    }
  };

  const loadQuotes = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('http://localhost:8080/v1/taproot-assets/rfq/quotes/peeraccepted');
      if (!response.ok) throw new Error('Failed to load quotes');

      const data = await response.json();
      setQuotes(data);
      setSuccess('Quotes loaded successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load quotes');
    } finally {
      setLoading(false);
    }
  };

  const buyQuotes = quotes?.buy_quotes || [];
  const sellQuotes = quotes?.sell_quotes || [];

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <h2 style={{ color: '#ffffff', marginBottom: '10px', textAlign: 'center' }}>
        💱 RFQ Market
      </h2>
      <p style={{ color: '#a0a0a0', textAlign: 'center', marginBottom: '30px', fontSize: '14px' }}>
        Create buy/sell offers and trade assets via Request-For-Quote protocol
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
          ✅ {success}
        </div>
      )}

      {/* Create Offers */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '25px' }}>
        {/* Buy Offer */}
        <div style={{
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '12px',
          padding: '25px'
        }}>
          <h3 style={{ color: '#ffffff', marginBottom: '20px', fontSize: '18px' }}>
            💰 Create Buy Offer
          </h3>

          <div style={{ marginBottom: '15px' }}>
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

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', color: '#a0a0a0', marginBottom: '8px', fontSize: '14px' }}>
              Max Units
            </label>
            <input
              type="number"
              value={maxUnits}
              onChange={(e) => setMaxUnits(e.target.value)}
              min="1"
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

          <button
            onClick={createBuyOffer}
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
              opacity: loading ? 0.6 : 1
            }}
          >
            {loading ? '⏳ Creating...' : '💰 Create Buy Offer'}
          </button>
        </div>

        {/* Sell Offer */}
        <div style={{
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '12px',
          padding: '25px'
        }}>
          <h3 style={{ color: '#ffffff', marginBottom: '20px', fontSize: '18px' }}>
            💵 Create Sell Offer
          </h3>

          <div style={{ marginBottom: '15px' }}>
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

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', color: '#a0a0a0', marginBottom: '8px', fontSize: '14px' }}>
              Max Units
            </label>
            <input
              type="number"
              value={maxUnits}
              onChange={(e) => setMaxUnits(e.target.value)}
              min="1"
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

          <button
            onClick={createSellOffer}
            disabled={loading || !selectedAsset}
            style={{
              width: '100%',
              background: !selectedAsset || loading ? 'rgba(255,255,255,0.1)' : 'linear-gradient(135deg, #ff4444 0%, #cc0000 100%)',
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
            {loading ? '⏳ Creating...' : '💵 Create Sell Offer'}
          </button>
        </div>
      </div>

      {/* Active Quotes */}
      <div style={{
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '12px',
        padding: '25px',
        marginBottom: '25px'
      }}>
        <h3 style={{ color: '#ffffff', marginBottom: '20px', fontSize: '18px' }}>
          📊 Active Quotes
        </h3>

        <button
          onClick={loadQuotes}
          disabled={loading}
          style={{
            background: loading ? 'rgba(255,255,255,0.1)' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: '#ffffff',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '8px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            opacity: loading ? 0.6 : 1,
            marginBottom: '20px'
          }}
        >
          {loading ? '⏳ Loading...' : '📋 Load Peer Quotes'}
        </button>

        {quotes && (
          <div>
            {buyQuotes.length === 0 && sellQuotes.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#a0a0a0' }}>
                No active quotes found
              </div>
            ) : (
              <>
                {buyQuotes.length > 0 && (
                  <div style={{ marginBottom: '20px' }}>
                    <h4 style={{ color: '#ffffff', marginBottom: '15px', fontSize: '16px' }}>
                      💰 Buy Quotes ({buyQuotes.length})
                    </h4>
                    {buyQuotes.map((quote: any, idx: number) => (
                      <div
                        key={idx}
                        style={{
                          background: 'rgba(0, 255, 65, 0.05)',
                          border: '1px solid rgba(0, 255, 65, 0.2)',
                          borderRadius: '8px',
                          padding: '15px',
                          marginBottom: '10px'
                        }}
                      >
                        <div style={{ color: '#00ff41', fontSize: '14px', fontWeight: '600', marginBottom: '10px' }}>
                          Peer: {quote.peer || 'Unknown'}
                        </div>
                        <div style={{ color: '#d0d0d0', fontSize: '13px' }}>
                          Max Amount: {quote.asset_max_amount || 'N/A'}
                        </div>
                        {quote.expiry && (
                          <div style={{ color: '#a0a0a0', fontSize: '12px', marginTop: '5px' }}>
                            Expires: {new Date(parseInt(quote.expiry) * 1000).toLocaleString()}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {sellQuotes.length > 0 && (
                  <div>
                    <h4 style={{ color: '#ffffff', marginBottom: '15px', fontSize: '16px' }}>
                      💵 Sell Quotes ({sellQuotes.length})
                    </h4>
                    {sellQuotes.map((quote: any, idx: number) => (
                      <div
                        key={idx}
                        style={{
                          background: 'rgba(255, 68, 68, 0.05)',
                          border: '1px solid rgba(255, 68, 68, 0.2)',
                          borderRadius: '8px',
                          padding: '15px',
                          marginBottom: '10px'
                        }}
                      >
                        <div style={{ color: '#ff4444', fontSize: '14px', fontWeight: '600', marginBottom: '10px' }}>
                          Peer: {quote.peer || 'Unknown'}
                        </div>
                        <div style={{ color: '#d0d0d0', fontSize: '13px' }}>
                          Asset Amount: {quote.asset_amount || 'N/A'}
                        </div>
                        {quote.expiry && (
                          <div style={{ color: '#a0a0a0', fontSize: '12px', marginTop: '5px' }}>
                            Expires: {new Date(parseInt(quote.expiry) * 1000).toLocaleString()}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* Info Panel */}
      <div style={{
        background: 'rgba(102, 126, 234, 0.1)',
        border: '1px solid rgba(102, 126, 234, 0.3)',
        borderRadius: '12px',
        padding: '20px'
      }}>
        <h3 style={{ color: '#667eea', marginBottom: '15px', fontSize: '16px' }}>
          ℹ️ About RFQ Trading
        </h3>
        <div style={{ color: '#a0a0a0', fontSize: '14px', lineHeight: '1.6' }}>
          <p style={{ marginBottom: '10px' }}>
            The Request-For-Quote (RFQ) protocol enables peer-to-peer asset trading:
          </p>
          <ul style={{ paddingLeft: '20px', margin: '10px 0' }}>
            <li><strong>Buy Offers:</strong> Express interest in purchasing assets</li>
            <li><strong>Sell Offers:</strong> List assets you want to sell</li>
            <li><strong>Peer Quotes:</strong> View and accept quotes from other nodes</li>
          </ul>
          <p style={{ marginTop: '10px' }}>
            RFQ enables decentralized, trustless trading directly between Lightning Network nodes.
          </p>
        </div>
      </div>
    </div>
  );
}
