import { useState } from 'react';
import * as React from 'react';
import { useTaprootAssets } from './hooks/useTaprootAssets';
import { AssetCard } from './components/AssetCard';
import { ConnectionStatus } from './components/ConnectionStatus';
import { MintWizard } from './components/MintWizard';
import { TransferHistory } from './components/TransferHistory';
import { NetworkStats } from './components/NetworkStats';
import { BurnAssets } from './components/BurnAssets';
import { UniverseExplorer } from './components/UniverseExplorer';
import { ProofsExplorer } from './components/ProofsExplorer';
import { WalletExplorer } from './components/WalletExplorer';
import { RFQMarket } from './components/RFQMarket';
import './App.css';

type Tab = 'portfolio' | 'mint' | 'send' | 'receive' | 'transfers' | 'burn' | 'network' | 'universe' | 'proofs' | 'wallet' | 'rfq';

function App() {
  const { assets, balances, loading, error, connected, refresh } = useTaprootAssets();
  const [activeTab, setActiveTab] = useState<Tab>('portfolio');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAsset, setSelectedAsset] = useState('');
  const [sendAddress, setSendAddress] = useState('');
  const [sendAmount, setSendAmount] = useState('');
  const [receiveAmount, setReceiveAmount] = useState('');
  const [generatedAddress, setGeneratedAddress] = useState('');
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  // Update last update time when assets change
  React.useEffect(() => {
    if (assets.length > 0 && !loading) {
      setLastUpdate(new Date());
    }
  }, [assets, loading]);

  // Group assets by asset_id
  const groupedAssets = (() => {
    const map = new Map();
    assets.forEach((asset) => {
      const assetId = asset.asset_id || asset.asset_genesis?.asset_id || '';
      if (!map.has(assetId)) {
        const matchingAssets = assets.filter(a => (a.asset_id || a.asset_genesis?.asset_id) === assetId);
        const totalAmount = matchingAssets.reduce((sum, a) => sum + parseInt(a.amount || '0'), 0);
        const utxoCount = matchingAssets.length;
        map.set(assetId, { ...asset, totalAmount, utxoCount });
      }
    });
    return Array.from(map.values());
  })();

  // Filter assets by search
  const filteredAssets = groupedAssets.filter(asset => {
    const name = asset.asset_genesis?.name || '';
    const assetId = asset.asset_id || '';
    return name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           assetId.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Calculate stats
  const totalAssets = groupedAssets.length;
  const totalValue = groupedAssets.reduce((sum, asset) => sum + (asset.totalAmount || 0), 0);

  const handleGenerateAddress = async () => {
    if (!selectedAsset) return;

    // Use "1" as default amount if not specified (gateway requires amt > 0)
    const amount = receiveAmount && parseInt(receiveAmount) > 0 ? receiveAmount : '1';

    try {
      const response = await fetch('http://localhost:8080/v1/taproot-assets/addrs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          asset_id: selectedAsset,
          amt: amount
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to generate address: ${response.statusText}`);
      }

      const data = await response.json();
      setGeneratedAddress(data.encoded || 'Address generation failed');
    } catch (err) {
      console.error('Failed to generate address:', err);
      setGeneratedAddress(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const handleSend = async () => {
    if (!selectedAsset || !sendAddress || !sendAmount) return;

    try {
      const response = await fetch('http://localhost:8080/v1/taproot-assets/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tap_addrs: [sendAddress],
          fee_rate: 1000
        })
      });

      if (response.ok) {
        alert('✅ Send initiated! Check the Transfers tab.');
        setSendAddress('');
        setSendAmount('');
        refresh();
      }
    } catch (err) {
      console.error('Failed to send:', err);
      alert('❌ Send failed');
    }
  };

  return (
    <div style={{ minHeight: '100vh', padding: '20px', position: 'relative', zIndex: 1 }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Animated Logo */}
        <div style={{ textAlign: 'center', marginBottom: '30px', animation: 'fadeIn 0.8s ease-out' }}>
          <img
            src="/privkey-logo.png"
            alt="PrivKey LLC"
            style={{
              display: 'inline-block',
              maxWidth: '320px',
              filter: 'drop-shadow(0 10px 30px rgba(0,0,0,0.5))',
              transition: 'transform 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          />
        </div>

        {/* Hero Section */}
        <div style={{ textAlign: 'center', marginBottom: '40px', animation: 'fadeIn 1s ease-out' }}>
          <h1 style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            fontSize: '3.5em',
            fontWeight: '800',
            marginBottom: '15px',
            letterSpacing: '-0.02em'
          }}>
            💎 Taproot Assets Suite
          </h1>
          <p style={{
            color: 'rgba(255,255,255,0.7)',
            fontSize: '18px',
            maxWidth: '700px',
            margin: '0 auto',
            lineHeight: '1.6'
          }}>
            Full-featured React + TypeScript demo showcasing the complete power of{' '}
            <span style={{
              color: '#00ff41',
              fontWeight: '600',
              textShadow: '0 0 10px rgba(0,255,65,0.3)'
            }}>
              taproot-assets-rest-gateway
            </span>
          </p>
        </div>

        {/* Stats Dashboard */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '20px',
          marginBottom: '40px',
          animation: 'fadeIn 1.2s ease-out'
        }}>
          <div style={{
            background: 'rgba(26, 26, 46, 0.8)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '16px',
            padding: '28px',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
            transition: 'all 0.3s ease',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-5px)';
            e.currentTarget.style.borderColor = 'rgba(102, 126, 234, 0.5)';
            e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
            e.currentTarget.style.boxShadow = 'none';
          }}
          >
            <div style={{ fontSize: '3em', marginBottom: '10px', filter: 'drop-shadow(0 5px 15px rgba(102, 126, 234, 0.3))' }}>📦</div>
            <div style={{ color: '#a0a0a0', fontSize: '0.85em', marginBottom: '8px', letterSpacing: '1px', fontWeight: '500' }}>TOTAL ASSETS</div>
            <div style={{ color: '#ffffff', fontSize: '2.5em', fontWeight: '800' }}>{totalAssets}</div>
          </div>

          <div style={{
            background: 'rgba(26, 26, 46, 0.8)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '16px',
            padding: '28px',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
            transition: 'all 0.3s ease',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-5px)';
            e.currentTarget.style.borderColor = 'rgba(0, 255, 65, 0.5)';
            e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
            e.currentTarget.style.boxShadow = 'none';
          }}
          >
            <div style={{ fontSize: '3em', marginBottom: '10px', filter: 'drop-shadow(0 5px 15px rgba(0, 255, 65, 0.3))' }}>💰</div>
            <div style={{ color: '#a0a0a0', fontSize: '0.85em', marginBottom: '8px', letterSpacing: '1px', fontWeight: '500' }}>TOTAL UNITS</div>
            <div style={{
              color: '#00ff41',
              fontSize: '2.5em',
              fontWeight: '800',
              textShadow: '0 0 20px rgba(0, 255, 65, 0.4)'
            }}>{totalValue.toLocaleString()}</div>
          </div>
        </div>

        {/* Main Card */}
        <div style={{
          background: 'rgba(26, 26, 46, 0.8)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          borderRadius: '24px',
          padding: '40px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
          animation: 'fadeIn 1.4s ease-out'
        }}>
          <ConnectionStatus connected={connected} error={error} />

          {/* Tabs */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
            gap: '8px',
            marginBottom: '35px',
            borderBottom: '2px solid rgba(255,255,255,0.08)',
            paddingBottom: '16px'
          }}>
            {(['portfolio', 'mint', 'send', 'receive', 'transfers', 'burn', 'network', 'universe', 'proofs', 'wallet', 'rfq'] as Tab[]).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  background: activeTab === tab
                    ? 'linear-gradient(135deg, rgba(102, 126, 234, 0.3) 0%, rgba(118, 75, 162, 0.3) 100%)'
                    : 'transparent',
                  color: activeTab === tab ? '#ffffff' : '#a0a0a0',
                  border: activeTab === tab ? '1px solid rgba(102, 126, 234, 0.5)' : '1px solid transparent',
                  padding: '10px 12px',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: '600',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  whiteSpace: 'nowrap',
                  position: 'relative',
                  overflow: 'hidden',
                  textAlign: 'center'
                }}
                onMouseEnter={(e) => {
                  if (activeTab !== tab) {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                    e.currentTarget.style.color = '#ffffff';
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeTab !== tab) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = '#a0a0a0';
                  }
                }}
              >
                {tab === 'portfolio' && '📊 Portfolio'}
                {tab === 'mint' && '🪙 Mint'}
                {tab === 'send' && '📤 Send'}
                {tab === 'receive' && '📥 Receive'}
                {tab === 'transfers' && '📜 Transfers'}
                {tab === 'burn' && '🔥 Burn'}
                {tab === 'network' && '🌐 Network'}
                {tab === 'universe' && '🌌 Universe'}
                {tab === 'proofs' && '📜 Proofs'}
                {tab === 'wallet' && '🔑 Wallet'}
                {tab === 'rfq' && '💱 RFQ'}
              </button>
            ))}
          </div>

          {/* Portfolio Tab */}
          {activeTab === 'portfolio' && (
            <div>
              {/* Last Updated & Search Bar */}
              {lastUpdate && (
                <div style={{
                  textAlign: 'center',
                  color: 'rgba(255, 255, 255, 0.6)',
                  fontSize: '13px',
                  marginBottom: '15px',
                  fontWeight: '500'
                }}>
                  Last updated: {lastUpdate.toLocaleTimeString()} • Auto-refresh every 10s
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', gap: '10px' }}>
                <input
                  type="text"
                  placeholder="🔍 Search assets by name or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '14px 18px',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    color: '#ffffff',
                    fontSize: '14px',
                    transition: 'all 0.3s ease'
                  }}
                />
                <button
                  onClick={() => {
                    refresh();
                    setLastUpdate(new Date());
                  }}
                  disabled={loading}
                  style={{
                    background: loading
                      ? 'rgba(255, 255, 255, 0.5)'
                      : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: '#ffffff',
                    border: 'none',
                    padding: '14px 32px',
                    borderRadius: '12px',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    opacity: loading ? 0.6 : 1,
                    fontSize: '14px',
                    fontWeight: '700',
                    boxShadow: loading ? 'none' : '0 4px 15px rgba(102, 126, 234, 0.4)',
                    transition: 'all 0.3s ease',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {loading ? '⟳ Refreshing...' : '🔄 Refresh Now'}
                </button>
              </div>

              {loading && assets.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '80px', color: '#a0a0a0' }}>
                  <div style={{
                    fontSize: '64px',
                    marginBottom: '20px',
                    animation: 'pulse 1.5s ease-in-out infinite'
                  }}>⏳</div>
                  <div style={{ fontSize: '18px', fontWeight: '500' }}>Loading assets...</div>
                </div>
              ) : filteredAssets.length === 0 ? (
                <div style={{
                  textAlign: 'center',
                  padding: '80px 40px',
                  background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
                  borderRadius: '20px',
                  border: '2px dashed rgba(255, 255, 255, 0.1)',
                  color: '#a0a0a0'
                }}>
                  <div style={{
                    fontSize: '72px',
                    marginBottom: '20px',
                    filter: 'drop-shadow(0 10px 30px rgba(102, 126, 234, 0.3))',
                    animation: 'float 3s ease-in-out infinite'
                  }}>💎</div>
                  <h3 style={{
                    color: '#ffffff',
                    marginBottom: '15px',
                    fontSize: '24px',
                    fontWeight: '700'
                  }}>No assets found</h3>
                  <p style={{ fontSize: '16px', maxWidth: '400px', margin: '0 auto' }}>
                    Start by minting your first asset in the Mint tab, or connect to a wallet with existing assets!
                  </p>
                </div>
              ) : (
                <div style={{ display: 'grid', gap: '20px', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))' }}>
                  {filteredAssets.map((asset, index) => (
                    <AssetCard
                      key={`${asset.asset_id}-${index}`}
                      asset={asset}
                      balance={asset.totalAmount?.toString()}
                      utxoCount={asset.utxoCount}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Send Tab */}
          {activeTab === 'send' && (
            <div style={{ maxWidth: '600px', margin: '0 auto' }}>
              <h2 style={{ color: '#ffffff', marginBottom: '20px' }}>📤 Send Assets</h2>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', color: '#a0a0a0', marginBottom: '8px', fontSize: '14px' }}>Select Asset</label>
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

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', color: '#a0a0a0', marginBottom: '8px', fontSize: '14px' }}>Recipient Address</label>
                <textarea
                  value={sendAddress}
                  onChange={(e) => setSendAddress(e.target.value)}
                  placeholder="Paste Taproot Assets address here"
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    color: '#ffffff',
                    fontSize: '14px',
                    fontFamily: 'monospace',
                    resize: 'vertical'
                  }}
                />
              </div>

              <div style={{ marginBottom: '30px' }}>
                <label style={{ display: 'block', color: '#a0a0a0', marginBottom: '8px', fontSize: '14px' }}>Amount</label>
                <input
                  type="number"
                  value={sendAmount}
                  onChange={(e) => setSendAmount(e.target.value)}
                  placeholder="Amount to send"
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
                onClick={handleSend}
                disabled={!selectedAsset || !sendAddress || !sendAmount}
                style={{
                  width: '100%',
                  background: selectedAsset && sendAddress && sendAmount ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'rgba(255,255,255,0.1)',
                  color: '#ffffff',
                  border: 'none',
                  padding: '16px',
                  borderRadius: '8px',
                  cursor: selectedAsset && sendAddress && sendAmount ? 'pointer' : 'not-allowed',
                  fontSize: '16px',
                  fontWeight: '600',
                  transition: 'all 0.3s'
                }}
              >
                Send Assets
              </button>

              <div style={{ marginTop: '20px', padding: '15px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', fontSize: '14px', color: '#a0a0a0' }}>
                💡 <strong style={{ color: '#ffffff' }}>Tip:</strong> Generate an address in the Receive tab, then paste it here to test!
              </div>
            </div>
          )}

          {/* Receive Tab */}
          {activeTab === 'receive' && (
            <div style={{ maxWidth: '600px', margin: '0 auto' }}>
              <h2 style={{ color: '#ffffff', marginBottom: '20px' }}>📥 Receive Assets</h2>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', color: '#a0a0a0', marginBottom: '8px', fontSize: '14px' }}>Select Asset</label>
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

              <div style={{ marginBottom: '30px' }}>
                <label style={{ display: 'block', color: '#a0a0a0', marginBottom: '8px', fontSize: '14px' }}>
                  Amount (defaults to 1 if not specified)
                </label>
                <input
                  type="number"
                  value={receiveAmount}
                  onChange={(e) => setReceiveAmount(e.target.value)}
                  placeholder="1"
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
                onClick={handleGenerateAddress}
                disabled={!selectedAsset}
                style={{
                  width: '100%',
                  background: selectedAsset ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'rgba(255,255,255,0.1)',
                  color: '#ffffff',
                  border: 'none',
                  padding: '16px',
                  borderRadius: '8px',
                  cursor: selectedAsset ? 'pointer' : 'not-allowed',
                  fontSize: '16px',
                  fontWeight: '600',
                  marginBottom: '30px'
                }}
              >
                Generate Address
              </button>

              {generatedAddress && (
                <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '20px' }}>
                  <div style={{ color: '#ffffff', fontWeight: '600', marginBottom: '10px' }}>Your Address:</div>
                  <div style={{
                    background: 'rgba(0,0,0,0.3)',
                    padding: '15px',
                    borderRadius: '8px',
                    wordBreak: 'break-all',
                    fontFamily: 'monospace',
                    fontSize: '13px',
                    color: '#00ff41',
                    marginBottom: '15px'
                  }}>
                    {generatedAddress}
                  </div>
                  <button
                    onClick={() => navigator.clipboard.writeText(generatedAddress)}
                    style={{
                      background: 'rgba(255,255,255,0.9)',
                      color: '#000000',
                      border: 'none',
                      padding: '10px 20px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '600'
                    }}
                  >
                    📋 Copy Address
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Mint Tab */}
          {activeTab === 'mint' && <MintWizard />}

          {/* Transfers Tab */}
          {activeTab === 'transfers' && <TransferHistory />}

          {/* Burn Tab */}
          {activeTab === 'burn' && <BurnAssets />}

          {/* Network Tab */}
          {activeTab === 'network' && <NetworkStats />}

          {/* Universe Tab */}
          {activeTab === 'universe' && <UniverseExplorer />}

          {/* Proofs Tab */}
          {activeTab === 'proofs' && <ProofsExplorer />}

          {/* Wallet Tab */}
          {activeTab === 'wallet' && <WalletExplorer />}

          {/* RFQ Tab */}
          {activeTab === 'rfq' && <RFQMarket />}
        </div>

        {/* Footer */}
        <div style={{
          textAlign: 'center',
          marginTop: '50px',
          padding: '30px',
          background: 'rgba(26, 26, 46, 0.5)',
          backdropFilter: 'blur(10px)',
          borderRadius: '20px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          animation: 'fadeIn 1.6s ease-out'
        }}>
          <div style={{
            fontSize: '16px',
            fontWeight: '600',
            marginBottom: '15px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            ⚡ Built with Modern Stack
          </div>
          <div style={{
            fontSize: '14px',
            color: 'rgba(255, 255, 255, 0.6)',
            marginBottom: '12px',
            display: 'flex',
            gap: '15px',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            <span style={{
              background: 'rgba(255,255,255,0.05)',
              padding: '6px 14px',
              borderRadius: '20px',
              border: '1px solid rgba(255,255,255,0.1)'
            }}>React 19</span>
            <span style={{
              background: 'rgba(255,255,255,0.05)',
              padding: '6px 14px',
              borderRadius: '20px',
              border: '1px solid rgba(255,255,255,0.1)'
            }}>TypeScript</span>
            <span style={{
              background: 'rgba(255,255,255,0.05)',
              padding: '6px 14px',
              borderRadius: '20px',
              border: '1px solid rgba(255,255,255,0.1)'
            }}>Bun</span>
            <span style={{
              background: 'rgba(255,255,255,0.05)',
              padding: '6px 14px',
              borderRadius: '20px',
              border: '1px solid rgba(255,255,255,0.1)'
            }}>Vite</span>
          </div>
          <div style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.5)', marginTop: '15px' }}>
            <div style={{ marginBottom: '8px' }}>
              🌐 Gateway: <span style={{ color: '#00ff41', fontFamily: 'monospace' }}>http://localhost:8080</span>
            </div>
            <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.4)' }}>
              Features: Mint • Send • Receive • Burn • Transfers • Network • Universe • Proofs • Wallet • RFQ
            </div>
          </div>
          <div style={{
            fontSize: '13px',
            marginTop: '20px',
            paddingTop: '20px',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            color: 'rgba(255, 255, 255, 0.5)'
          }}>
            🚀 Showcasing the full power of <span style={{
              color: '#00ff41',
              fontWeight: '600',
              textShadow: '0 0 10px rgba(0,255,65,0.3)'
            }}>taproot-assets-rest-gateway</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
