import { useNetworkStats } from '../hooks/useNetworkStats';

export function NetworkStats() {
  const { stats, daemonInfo, assetStats, loading, error, refresh } = useNetworkStats();

  if (loading && !stats && !daemonInfo) {
    return (
      <div style={{ textAlign: 'center', padding: '60px', color: '#a0a0a0' }}>
        <div style={{ fontSize: '48px', marginBottom: '20px', opacity: 0.6 }}>⏳</div>
        <div style={{ fontSize: '15px' }}>Loading network statistics...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h2 style={{ color: '#ffffff', marginBottom: '10px', textAlign: 'center' }}>
          🌐 Network Explorer
        </h2>
        <p style={{ color: '#a0a0a0', textAlign: 'center', marginBottom: '30px', fontSize: '14px' }}>
          Monitor daemon status and network statistics
        </p>
        <div style={{
          background: 'rgba(255, 68, 68, 0.1)',
          border: '1px solid rgba(255, 68, 68, 0.3)',
          borderRadius: '12px',
          padding: '30px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '15px' }}>⚠️</div>
          <h3 style={{ color: '#ff4444', marginBottom: '10px', fontSize: '18px' }}>Error Loading Stats</h3>
          <p style={{ color: '#a0a0a0', fontSize: '14px' }}>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 style={{ color: '#ffffff', marginBottom: '10px', textAlign: 'center' }}>
        🌐 Network Explorer
      </h2>
      <p style={{ color: '#a0a0a0', textAlign: 'center', marginBottom: '15px', fontSize: '14px' }}>
        Monitor daemon status and network statistics
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
            About Network Statistics
          </h3>
        </div>
        <div style={{ color: '#a0a0a0', fontSize: '14px', lineHeight: '1.7' }}>
          <p style={{ marginBottom: '15px', color: '#c0c0c0' }}>
            The network explorer provides real-time insights into your Taproot Assets daemon:
          </p>
          <div style={{ display: 'grid', gap: '12px', marginBottom: '15px' }}>
            <div style={{
              background: 'rgba(102, 126, 234, 0.05)',
              padding: '12px 15px',
              borderRadius: '8px',
              border: '1px solid rgba(102, 126, 234, 0.15)'
            }}>
              <div style={{ color: '#667eea', fontWeight: '600', marginBottom: '4px', fontSize: '14px' }}>
                ⚡ Daemon Info
              </div>
              <div style={{ fontSize: '13px' }}>
                Version information, network type, and identity keys for your node
              </div>
            </div>
            <div style={{
              background: 'rgba(118, 75, 162, 0.05)',
              padding: '12px 15px',
              borderRadius: '8px',
              border: '1px solid rgba(118, 75, 162, 0.15)'
            }}>
              <div style={{ color: '#764ba2', fontWeight: '600', marginBottom: '4px', fontSize: '14px' }}>
                🌌 Universe Stats
              </div>
              <div style={{ fontSize: '13px' }}>
                Global statistics including total assets, groups, syncs, and proofs
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
            <strong style={{ color: '#667eea' }}>💡 Pro Tip:</strong> Regularly refresh statistics to monitor network activity and asset distribution in real-time.
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
          <li>View daemon information including Tapd and LND versions</li>
          <li>Monitor universe statistics like total assets and groups</li>
          <li>Check asset distribution across the network</li>
          <li>Click "Refresh" to update statistics in real-time</li>
        </ol>
      </div>

      <div style={{
        display: 'flex',
        justifyContent: 'flex-end',
        marginBottom: '20px'
      }}>
        <button
          onClick={refresh}
          disabled={loading}
          style={{
            background: loading ? 'rgba(255,255,255,0.1)' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: '#ffffff',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '8px',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.6 : 1,
            fontSize: '14px',
            fontWeight: '600',
            transition: 'all 0.3s'
          }}
        >
          {loading ? '⏳ Refreshing...' : '🔄 Refresh Stats'}
        </button>
      </div>

      {/* Daemon Info */}
      {daemonInfo && (
        <div style={{
          background: 'rgba(102, 126, 234, 0.1)',
          border: '1px solid rgba(102, 126, 234, 0.3)',
          borderRadius: '12px',
          padding: '25px',
          marginBottom: '25px'
        }}>
          <h3 style={{ color: '#667eea', marginBottom: '20px', fontSize: '18px' }}>
            ⚡ Daemon Information
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
            <div>
              <div style={{ color: '#a0a0a0', fontSize: '12px', marginBottom: '5px' }}>
                Tapd Version
              </div>
              <div style={{ color: '#ffffff', fontSize: '16px', fontWeight: '600' }}>
                {daemonInfo.version || 'N/A'}
              </div>
            </div>
            <div>
              <div style={{ color: '#a0a0a0', fontSize: '12px', marginBottom: '5px' }}>
                LND Version
              </div>
              <div style={{ color: '#ffffff', fontSize: '16px', fontWeight: '600' }}>
                {daemonInfo.lnd_version || 'N/A'}
              </div>
            </div>
            <div>
              <div style={{ color: '#a0a0a0', fontSize: '12px', marginBottom: '5px' }}>
                Network
              </div>
              <div style={{ color: '#ffffff', fontSize: '16px', fontWeight: '600' }}>
                {daemonInfo.network || 'N/A'}
              </div>
            </div>
            <div>
              <div style={{ color: '#a0a0a0', fontSize: '12px', marginBottom: '5px' }}>
                Debug Level
              </div>
              <div style={{ color: '#ffffff', fontSize: '16px', fontWeight: '600' }}>
                {daemonInfo.debug_level || 'N/A'}
              </div>
            </div>
          </div>

          {daemonInfo.identity_pubkey && (
            <div style={{ marginTop: '20px' }}>
              <div style={{ color: '#a0a0a0', fontSize: '12px', marginBottom: '8px' }}>
                Tapd Identity
              </div>
              <div style={{
                background: 'rgba(0,0,0,0.3)',
                padding: '12px',
                borderRadius: '8px',
                fontFamily: 'monospace',
                fontSize: '13px',
                color: '#00ff41',
                wordBreak: 'break-all'
              }}>
                {daemonInfo.identity_pubkey}
              </div>
            </div>
          )}

          {daemonInfo.lnd_identity_pubkey && (
            <div style={{ marginTop: '15px' }}>
              <div style={{ color: '#a0a0a0', fontSize: '12px', marginBottom: '8px' }}>
                LND Identity
              </div>
              <div style={{
                background: 'rgba(0,0,0,0.3)',
                padding: '12px',
                borderRadius: '8px',
                fontFamily: 'monospace',
                fontSize: '13px',
                color: '#00ff41',
                wordBreak: 'break-all'
              }}>
                {daemonInfo.lnd_identity_pubkey}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Universe Stats */}
      {stats && (
        <div style={{
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '12px',
          padding: '25px',
          marginBottom: '25px'
        }}>
          <h3 style={{ color: '#ffffff', marginBottom: '20px', fontSize: '18px' }}>
            🌌 Universe Statistics
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '20px'
          }}>
            <div style={{
              background: 'rgba(0,0,0,0.3)',
              padding: '20px',
              borderRadius: '12px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>💎</div>
              <div style={{ color: '#00ff41', fontSize: '24px', fontWeight: 'bold', marginBottom: '5px' }}>
                {stats.num_total_assets || 0}
              </div>
              <div style={{ color: '#a0a0a0', fontSize: '13px' }}>Total Assets</div>
            </div>

            <div style={{
              background: 'rgba(0,0,0,0.3)',
              padding: '20px',
              borderRadius: '12px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>👥</div>
              <div style={{ color: '#667eea', fontSize: '24px', fontWeight: 'bold', marginBottom: '5px' }}>
                {stats.num_total_groups || 0}
              </div>
              <div style={{ color: '#a0a0a0', fontSize: '13px' }}>Asset Groups</div>
            </div>

            <div style={{
              background: 'rgba(0,0,0,0.3)',
              padding: '20px',
              borderRadius: '12px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>🔄</div>
              <div style={{ color: '#764ba2', fontSize: '24px', fontWeight: 'bold', marginBottom: '5px' }}>
                {stats.num_total_syncs || 0}
              </div>
              <div style={{ color: '#a0a0a0', fontSize: '13px' }}>Total Syncs</div>
            </div>

            <div style={{
              background: 'rgba(0,0,0,0.3)',
              padding: '20px',
              borderRadius: '12px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>📜</div>
              <div style={{ color: '#f093fb', fontSize: '24px', fontWeight: 'bold', marginBottom: '5px' }}>
                {stats.num_total_proofs || 0}
              </div>
              <div style={{ color: '#a0a0a0', fontSize: '13px' }}>Total Proofs</div>
            </div>
          </div>
        </div>
      )}

      {/* Asset Statistics */}
      {assetStats && assetStats.length > 0 && (
        <div>
          <h3 style={{ color: '#ffffff', marginBottom: '20px', fontSize: '18px' }}>
            📊 Asset Distribution
          </h3>
          <div style={{ display: 'grid', gap: '15px' }}>
            {assetStats.slice(0, 10).map((statEntry: any, index: number) => {
              const asset = statEntry.asset || statEntry;
              return (
                <div
                  key={index}
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    padding: '20px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ color: '#ffffff', fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>
                      {asset.asset_name || 'Unnamed Asset'}
                    </div>
                    <div style={{
                      color: '#a0a0a0',
                      fontSize: '12px',
                      fontFamily: 'monospace',
                      wordBreak: 'break-all'
                    }}>
                      {asset.asset_id?.substring(0, 32)}...
                    </div>
                  </div>
                  <div style={{
                    display: 'flex',
                    gap: '20px',
                    alignItems: 'center'
                  }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ color: '#00ff41', fontSize: '20px', fontWeight: 'bold' }}>
                        {asset.total_supply || statEntry.total_supply || 0}
                      </div>
                      <div style={{ color: '#a0a0a0', fontSize: '11px' }}>Supply</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ color: '#667eea', fontSize: '20px', fontWeight: 'bold' }}>
                        {statEntry.total_syncs || 0}
                      </div>
                      <div style={{ color: '#a0a0a0', fontSize: '11px' }}>Syncs</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {assetStats.length > 10 && (
            <div style={{
              textAlign: 'center',
              marginTop: '20px',
              color: '#a0a0a0',
              fontSize: '14px'
            }}>
              Showing 10 of {assetStats.length} assets
            </div>
          )}
        </div>
      )}

      {(!stats || !daemonInfo) && (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          background: 'rgba(0,0,0,0.2)',
          borderRadius: '12px',
          border: '2px dashed rgba(255,255,255,0.1)'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '15px', opacity: 0.6 }}>📡</div>
          <div style={{ color: '#a0a0a0', fontSize: '15px', marginBottom: '10px' }}>
            No network data available
          </div>
          <div style={{ color: '#666', fontSize: '13px' }}>
            Connect to a Taproot Assets daemon to view network statistics
          </div>
        </div>
      )}
    </div>
  );
}
