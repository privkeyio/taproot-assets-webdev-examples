import { useState, useEffect } from 'react';
import { useTaprootAssets } from '../hooks/useTaprootAssets';

export function RFQMarket() {
  const { assets } = useTaprootAssets();
  const [selectedAsset, setSelectedAsset] = useState('');
  const [maxUnits, setMaxUnits] = useState('1000');
  const [quotes, setQuotes] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(false);

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

  // Auto-refresh quotes every 5 seconds when enabled
  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        loadQuotes(true);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const createBuyOffer = async () => {
    if (!selectedAsset) {
      setError('Please select an asset');
      return;
    }

    if (!maxUnits || parseInt(maxUnits) <= 0) {
      setError('Please enter a valid amount greater than 0');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`http://localhost:8080/v1/taproot-assets/rfq/buyoffer/asset-id/${selectedAsset}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          asset_specifier: {},
          max_units: maxUnits
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to create buy offer: ${response.statusText}`);
      }

      const data = await response.json();
      setSuccess('✅ Buy offer created successfully! It may take a moment to appear in quotes.');
      setTimeout(() => {
        setSuccess(null);
        loadQuotes(true);
      }, 3000);
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

    if (!maxUnits || parseInt(maxUnits) <= 0) {
      setError('Please enter a valid amount greater than 0');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`http://localhost:8080/v1/taproot-assets/rfq/selloffer/asset-id/${selectedAsset}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          asset_specifier: {},
          max_units: maxUnits
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to create sell offer: ${response.statusText}`);
      }

      const data = await response.json();
      setSuccess('✅ Sell offer created successfully! It may take a moment to appear in quotes.');
      setTimeout(() => {
        setSuccess(null);
        loadQuotes(true);
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create sell offer');
    } finally {
      setLoading(false);
    }
  };

  const loadQuotes = async (silent = false) => {
    try {
      if (!silent) {
        setLoading(true);
        setError(null);
      }

      const response = await fetch('http://localhost:8080/v1/taproot-assets/rfq/quotes/peeraccepted');

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to load quotes: ${response.statusText}`);
      }

      const data = await response.json();
      setQuotes(data);

      if (!silent) {
        setSuccess('✅ Quotes loaded successfully!');
        setTimeout(() => setSuccess(null), 3000);
      }
    } catch (err) {
      if (!silent) {
        setError(err instanceof Error ? err.message : 'Failed to load quotes');
      }
      console.error('Failed to load quotes:', err);
    } finally {
      if (!silent) {
        setLoading(false);
      }
    }
  };

  const buyQuotes = quotes?.buy_quotes || [];
  const sellQuotes = quotes?.sell_quotes || [];

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <h2 style={{ color: '#ffffff', marginBottom: '10px', textAlign: 'center' }}>
        💱 RFQ Market
      </h2>
      <p style={{ color: '#a0a0a0', textAlign: 'center', marginBottom: '15px', fontSize: '14px' }}>
        Create buy/sell offers and trade assets via Request-For-Quote protocol
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
            About RFQ Trading
          </h3>
        </div>
        <div style={{ color: '#a0a0a0', fontSize: '14px', lineHeight: '1.7' }}>
          <p style={{ marginBottom: '15px', color: '#c0c0c0' }}>
            The Request-For-Quote (RFQ) protocol enables peer-to-peer asset trading over the Lightning Network:
          </p>
          <div style={{ display: 'grid', gap: '12px', marginBottom: '15px' }}>
            <div style={{
              background: 'rgba(0, 255, 65, 0.05)',
              padding: '12px 15px',
              borderRadius: '8px',
              border: '1px solid rgba(0, 255, 65, 0.15)'
            }}>
              <div style={{ color: '#00ff41', fontWeight: '600', marginBottom: '4px', fontSize: '14px' }}>
                💰 Buy Offers
              </div>
              <div style={{ fontSize: '13px' }}>
                Express interest in purchasing specific assets from peers
              </div>
            </div>
            <div style={{
              background: 'rgba(255, 68, 68, 0.05)',
              padding: '12px 15px',
              borderRadius: '8px',
              border: '1px solid rgba(255, 68, 68, 0.15)'
            }}>
              <div style={{ color: '#ff4444', fontWeight: '600', marginBottom: '4px', fontSize: '14px' }}>
                💵 Sell Offers
              </div>
              <div style={{ fontSize: '13px' }}>
                List your assets for sale and wait for interested buyers
              </div>
            </div>
            <div style={{
              background: 'rgba(102, 126, 234, 0.05)',
              padding: '12px 15px',
              borderRadius: '8px',
              border: '1px solid rgba(102, 126, 234, 0.15)'
            }}>
              <div style={{ color: '#667eea', fontWeight: '600', marginBottom: '4px', fontSize: '14px' }}>
                📊 Peer Quotes
              </div>
              <div style={{ fontSize: '13px' }}>
                View active offers from connected Lightning Network nodes
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
            <strong style={{ color: '#667eea' }}>💡 Pro Tip:</strong> Enable auto-refresh to monitor the market in real-time.
            RFQ quotes are peer-to-peer, so you'll need to be connected to other nodes to see active offers.
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
          <li>Select an asset and specify the max units you want to buy or sell</li>
          <li>Click "Create Buy Offer" or "Create Sell Offer" to submit your quote</li>
          <li>Click "Load Peer Quotes" to see active quotes from other nodes</li>
          <li>Enable auto-refresh to keep quotes updated in real-time</li>
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ color: '#ffffff', fontSize: '18px', margin: 0 }}>
            📊 Active Quotes
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#a0a0a0', fontSize: '13px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                style={{ cursor: 'pointer' }}
              />
              <span>Auto-refresh (5s)</span>
            </label>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
          <button
            onClick={() => loadQuotes(false)}
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
              flex: 1,
              minWidth: '200px'
            }}
          >
            {loading ? '⏳ Loading...' : '📋 Load Peer Quotes'}
          </button>

          {quotes && (
            <button
              onClick={() => setQuotes(null)}
              style={{
                background: 'rgba(255, 68, 68, 0.2)',
                color: '#ff4444',
                border: '1px solid rgba(255, 68, 68, 0.3)',
                padding: '12px 24px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 68, 68, 0.3)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 68, 68, 0.2)'}
            >
              🗑️ Clear
            </button>
          )}
        </div>

        {!quotes ? (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            background: 'rgba(0,0,0,0.2)',
            borderRadius: '12px',
            border: '2px dashed rgba(255,255,255,0.1)'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '15px', opacity: 0.6 }}>📊</div>
            <div style={{ color: '#a0a0a0', fontSize: '15px', marginBottom: '10px' }}>
              No quotes loaded yet
            </div>
            <div style={{ color: '#666', fontSize: '13px' }}>
              Click "Load Peer Quotes" to view active RFQ offers from peers
            </div>
          </div>
        ) : (
          <div>
            {buyQuotes.length === 0 && sellQuotes.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '50px 20px',
                background: 'rgba(102, 126, 234, 0.05)',
                borderRadius: '12px',
                border: '1px solid rgba(102, 126, 234, 0.2)'
              }}>
                <div style={{ fontSize: '40px', marginBottom: '12px' }}>📭</div>
                <div style={{ color: '#667eea', fontSize: '16px', marginBottom: '8px', fontWeight: '600' }}>
                  No Active Quotes
                </div>
                <div style={{ color: '#a0a0a0', fontSize: '13px' }}>
                  There are currently no peer-accepted buy or sell quotes.
                  <br />
                  Create an offer above to get started!
                </div>
              </div>
            ) : (
              <>
                {buyQuotes.length > 0 && (
                  <div style={{ marginBottom: '20px' }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      marginBottom: '15px',
                      padding: '10px 15px',
                      background: 'rgba(0, 255, 65, 0.08)',
                      borderRadius: '8px',
                      border: '1px solid rgba(0, 255, 65, 0.15)'
                    }}>
                      <span style={{ fontSize: '20px' }}>💰</span>
                      <h4 style={{ color: '#00ff41', fontSize: '16px', fontWeight: '700', margin: 0 }}>
                        Buy Quotes
                      </h4>
                      <span style={{
                        background: 'rgba(0, 255, 65, 0.2)',
                        color: '#00ff41',
                        padding: '3px 10px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: '700'
                      }}>
                        {buyQuotes.length}
                      </span>
                    </div>
                    <div style={{ display: 'grid', gap: '12px' }}>
                      {buyQuotes.map((quote: any, idx: number) => (
                        <div
                          key={idx}
                          style={{
                            background: 'rgba(0, 255, 65, 0.05)',
                            border: '1px solid rgba(0, 255, 65, 0.25)',
                            borderRadius: '10px',
                            padding: '16px',
                            transition: 'all 0.3s',
                            cursor: 'pointer'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(0, 255, 65, 0.1)';
                            e.currentTarget.style.borderColor = 'rgba(0, 255, 65, 0.4)';
                            e.currentTarget.style.transform = 'translateX(4px)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'rgba(0, 255, 65, 0.05)';
                            e.currentTarget.style.borderColor = 'rgba(0, 255, 65, 0.25)';
                            e.currentTarget.style.transform = 'translateX(0)';
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                            <div>
                              <div style={{ color: '#00ff41', fontSize: '14px', fontWeight: '700', marginBottom: '6px' }}>
                                🌐 Peer: {quote.peer?.substring(0, 16) || 'Unknown'}...
                              </div>
                              <div style={{ color: '#d0d0d0', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ color: '#a0a0a0' }}>Max Amount:</span>
                                <span style={{ fontWeight: '600', color: '#00ff41' }}>{quote.asset_max_amount || 'N/A'}</span>
                              </div>
                            </div>
                          </div>
                          {quote.expiry && (
                            <div style={{
                              color: '#a0a0a0',
                              fontSize: '12px',
                              marginTop: '8px',
                              paddingTop: '8px',
                              borderTop: '1px solid rgba(0, 255, 65, 0.1)',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px'
                            }}>
                              <span>⏱️</span>
                              <span>Expires: {new Date(parseInt(quote.expiry) * 1000).toLocaleString()}</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {sellQuotes.length > 0 && (
                  <div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      marginBottom: '15px',
                      padding: '10px 15px',
                      background: 'rgba(255, 68, 68, 0.08)',
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 68, 68, 0.15)'
                    }}>
                      <span style={{ fontSize: '20px' }}>💵</span>
                      <h4 style={{ color: '#ff4444', fontSize: '16px', fontWeight: '700', margin: 0 }}>
                        Sell Quotes
                      </h4>
                      <span style={{
                        background: 'rgba(255, 68, 68, 0.2)',
                        color: '#ff4444',
                        padding: '3px 10px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: '700'
                      }}>
                        {sellQuotes.length}
                      </span>
                    </div>
                    <div style={{ display: 'grid', gap: '12px' }}>
                      {sellQuotes.map((quote: any, idx: number) => (
                        <div
                          key={idx}
                          style={{
                            background: 'rgba(255, 68, 68, 0.05)',
                            border: '1px solid rgba(255, 68, 68, 0.25)',
                            borderRadius: '10px',
                            padding: '16px',
                            transition: 'all 0.3s',
                            cursor: 'pointer'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(255, 68, 68, 0.1)';
                            e.currentTarget.style.borderColor = 'rgba(255, 68, 68, 0.4)';
                            e.currentTarget.style.transform = 'translateX(4px)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'rgba(255, 68, 68, 0.05)';
                            e.currentTarget.style.borderColor = 'rgba(255, 68, 68, 0.25)';
                            e.currentTarget.style.transform = 'translateX(0)';
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                            <div>
                              <div style={{ color: '#ff4444', fontSize: '14px', fontWeight: '700', marginBottom: '6px' }}>
                                🌐 Peer: {quote.peer?.substring(0, 16) || 'Unknown'}...
                              </div>
                              <div style={{ color: '#d0d0d0', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ color: '#a0a0a0' }}>Asset Amount:</span>
                                <span style={{ fontWeight: '600', color: '#ff4444' }}>{quote.asset_amount || 'N/A'}</span>
                              </div>
                            </div>
                          </div>
                          {quote.expiry && (
                            <div style={{
                              color: '#a0a0a0',
                              fontSize: '12px',
                              marginTop: '8px',
                              paddingTop: '8px',
                              borderTop: '1px solid rgba(255, 68, 68, 0.1)',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px'
                            }}>
                              <span>⏱️</span>
                              <span>Expires: {new Date(parseInt(quote.expiry) * 1000).toLocaleString()}</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
