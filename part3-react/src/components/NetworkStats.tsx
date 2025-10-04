import { useNetworkStats } from '../hooks/useNetworkStats';

export function NetworkStats() {
  const { stats, daemonInfo, assetStats, loading, error, refresh } = useNetworkStats();

  if (loading && !stats && !daemonInfo) {
    return (
      <div style={{ textAlign: 'center', padding: '60px', color: '#a0a0a0' }}>
        <div style={{ fontSize: '48px', marginBottom: '20px' }}>⏳</div>
        Loading network statistics...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        background: 'rgba(255, 68, 68, 0.1)',
        border: '1px solid rgba(255, 68, 68, 0.3)',
        borderRadius: '12px',
        padding: '30px',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '48px', marginBottom: '20px' }}>⚠️</div>
        <h3 style={{ color: '#ff4444', marginBottom: '10px' }}>Error Loading Stats</h3>
        <p style={{ color: '#a0a0a0' }}>{error}</p>
      </div>
    );
  }

  return (
    <div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px'
      }}>
        <h2 style={{ color: '#ffffff', margin: 0 }}>🌐 Network Explorer</h2>
        <button
          onClick={refresh}
          disabled={loading}
          style={{
            background: 'rgba(255, 255, 255, 0.9)',
            color: '#000000',
            border: 'none',
            padding: '10px 20px',
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
          padding: '60px',
          background: 'rgba(255,255,255,0.05)',
          borderRadius: '12px'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>📡</div>
          <h3 style={{ color: '#ffffff', marginBottom: '10px' }}>No Network Data</h3>
          <p style={{ color: '#a0a0a0' }}>
            Connect to a Taproot Assets daemon to view network statistics
          </p>
        </div>
      )}
    </div>
  );
}
