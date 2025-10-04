import { useState } from 'react';
import { useTaprootAssets } from './hooks/useTaprootAssets';
import { AssetCard } from './components/AssetCard';
import { ConnectionStatus } from './components/ConnectionStatus';
import { MintWizard } from './components/MintWizard';
import { TransferHistory } from './components/TransferHistory';
import { NetworkStats } from './components/NetworkStats';
import { BurnAssets } from './components/BurnAssets';
import './App.css';

type Tab = 'portfolio' | 'mint' | 'send' | 'receive' | 'transfers' | 'burn' | 'network';

function App() {
  const { assets, balances, loading, error, connected, refresh } = useTaprootAssets();
  const [activeTab, setActiveTab] = useState<Tab>('portfolio');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAsset, setSelectedAsset] = useState('');
  const [sendAddress, setSendAddress] = useState('');
  const [sendAmount, setSendAmount] = useState('');
  const [receiveAmount, setReceiveAmount] = useState('');
  const [generatedAddress, setGeneratedAddress] = useState('');

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
    <div style={{ minHeight: '100vh', padding: '20px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <img
          src="/privkey-logo.png"
          alt="PrivKey LLC"
          style={{ display: 'block', maxWidth: '300px', margin: '0 auto 20px' }}
        />

        <h1 style={{ color: 'white', textAlign: 'center', fontSize: '2.5em', marginBottom: '10px' }}>
          💎 Taproot Assets Suite
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.8)', textAlign: 'center', marginBottom: '30px', fontSize: '16px' }}>
          Comprehensive React + TypeScript integration with REST Gateway
        </p>

        {/* Stats Dashboard */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
          <div style={{ background: 'rgba(26, 26, 46, 0.95)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px', padding: '20px', textAlign: 'center' }}>
            <div style={{ color: '#a0a0a0', fontSize: '0.9em', marginBottom: '5px' }}>TOTAL ASSETS</div>
            <div style={{ color: '#ffffff', fontSize: '2em', fontWeight: 'bold' }}>{totalAssets}</div>
          </div>
          <div style={{ background: 'rgba(26, 26, 46, 0.95)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px', padding: '20px', textAlign: 'center' }}>
            <div style={{ color: '#a0a0a0', fontSize: '0.9em', marginBottom: '5px' }}>TOTAL UNITS</div>
            <div style={{ color: '#00ff41', fontSize: '2em', fontWeight: 'bold' }}>{totalValue.toLocaleString()}</div>
          </div>
          <div style={{ background: 'rgba(26, 26, 46, 0.95)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px', padding: '20px', textAlign: 'center' }}>
            <div style={{ color: '#a0a0a0', fontSize: '0.9em', marginBottom: '5px' }}>CONNECTION</div>
            <div style={{ color: connected ? '#00ff41' : '#ff4444', fontSize: '2em', fontWeight: 'bold' }}>
              {connected ? '●' : '○'}
            </div>
          </div>
        </div>

        {/* Main Card */}
        <div style={{ background: 'rgba(26, 26, 46, 0.95)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '16px', padding: '30px', boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)' }}>
          <ConnectionStatus connected={connected} error={error} />

          {/* Tabs */}
          <div style={{
            display: 'flex',
            gap: '8px',
            marginBottom: '30px',
            borderBottom: '2px solid rgba(255,255,255,0.1)',
            paddingBottom: '10px',
            overflowX: 'auto',
            scrollbarWidth: 'thin'
          }}>
            {(['portfolio', 'mint', 'send', 'receive', 'transfers', 'burn', 'network'] as Tab[]).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  background: activeTab === tab ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
                  color: activeTab === tab ? '#ffffff' : '#a0a0a0',
                  border: 'none',
                  padding: '12px 20px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  transition: 'all 0.3s',
                  whiteSpace: 'nowrap',
                  flexShrink: 0
                }}
              >
                {tab === 'portfolio' && '📊 Portfolio'}
                {tab === 'mint' && '🪙 Mint'}
                {tab === 'send' && '📤 Send'}
                {tab === 'receive' && '📥 Receive'}
                {tab === 'transfers' && '📜 Transfers'}
                {tab === 'burn' && '🔥 Burn'}
                {tab === 'network' && '🌐 Network'}
              </button>
            ))}
          </div>

          {/* Portfolio Tab */}
          {activeTab === 'portfolio' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', gap: '10px' }}>
                <input
                  type="text"
                  placeholder="🔍 Search assets..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '12px',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    color: '#ffffff',
                    fontSize: '14px'
                  }}
                />
                <button
                  onClick={refresh}
                  disabled={loading}
                  style={{
                    background: 'rgba(255, 255, 255, 0.9)',
                    color: '#000000',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    opacity: loading ? 0.6 : 1,
                    fontSize: '14px',
                    fontWeight: '600'
                  }}
                >
                  {loading ? '⟳ Refreshing...' : '🔄 Refresh'}
                </button>
              </div>

              {loading && assets.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px', color: '#a0a0a0' }}>
                  <div style={{ fontSize: '48px', marginBottom: '20px' }}>⏳</div>
                  Loading assets...
                </div>
              ) : filteredAssets.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '12px', color: '#a0a0a0' }}>
                  <div style={{ fontSize: '48px', marginBottom: '20px' }}>💎</div>
                  <h3 style={{ color: '#ffffff', marginBottom: '10px' }}>No assets found</h3>
                  <p>Create some assets in Part 2 to see them here!</p>
                </div>
              ) : (
                <div style={{ display: 'grid', gap: '15px' }}>
                  {filteredAssets.map((asset, index) => (
                    <AssetCard
                      key={`${asset.asset_id}-${index}`}
                      asset={asset}
                      balance={asset.totalAmount?.toString()}
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
        </div>

        <div style={{ textAlign: 'center', marginTop: '30px', color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px' }}>
          <div style={{ marginBottom: '10px' }}>
            Built with React + TypeScript + Bun + Vite
          </div>
          <div style={{ fontSize: '12px' }}>
            Gateway: http://localhost:8080 | Features: Mint, Send, Receive, Burn, Network Stats
          </div>
          <div style={{ fontSize: '11px', marginTop: '8px', color: 'rgba(255, 255, 255, 0.5)' }}>
            Showcasing the full power of taproot-assets-rest-gateway
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
