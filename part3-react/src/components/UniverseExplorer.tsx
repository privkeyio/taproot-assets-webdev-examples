import { useState, useEffect } from 'react';

interface UniverseStats {
  num_total_assets: string;
  num_total_groups: string;
  num_total_syncs: string;
  num_total_proofs: string;
}

interface FederationServer {
  host: string;
  id: number;
}

export function UniverseExplorer() {
  const [stats, setStats] = useState<UniverseStats | null>(null);
  const [servers, setServers] = useState<FederationServer[]>([]);
  const [newServerHost, setNewServerHost] = useState('');
  const [syncHost, setSyncHost] = useState('127.0.0.1:8289');
  const [syncMode, setSyncMode] = useState('SYNC_ISSUANCE_ONLY');
  const [roots, setRoots] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    loadStats();
    loadServers();
  }, []);

  const loadStats = async () => {
    try {
      const response = await fetch('http://localhost:8080/v1/taproot-assets/universe/stats');
      if (!response.ok) throw new Error('Failed to load stats');
      const data = await response.json();
      setStats(data);
    } catch (err) {
      console.error('Error loading stats:', err);
    }
  };

  const loadServers = async () => {
    try {
      const response = await fetch('http://localhost:8080/v1/taproot-assets/universe/federation');
      if (!response.ok) throw new Error('Failed to load servers');
      const data = await response.json();
      setServers(data.servers || []);
    } catch (err) {
      console.error('Error loading servers:', err);
    }
  };

  const addServer = async () => {
    if (!newServerHost.trim()) {
      setError('Please enter a server host');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await fetch('http://localhost:8080/v1/taproot-assets/universe/federation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          servers: [{ host: newServerHost, id: Date.now() }]
        })
      });

      if (!response.ok) throw new Error('Failed to add server');

      setSuccess(`Server ${newServerHost} added successfully!`);
      setNewServerHost('');
      await loadServers();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add server');
    } finally {
      setLoading(false);
    }
  };

  const syncUniverse = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('http://localhost:8080/v1/taproot-assets/universe/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          universe_host: syncHost,
          sync_mode: syncMode,
          sync_targets: []
        })
      });

      if (!response.ok) throw new Error('Sync failed');

      const data = await response.json();
      setSuccess(`Sync initiated! Synced ${data.synced_universes?.length || 0} universes`);
      await loadStats();
      setTimeout(() => setSuccess(null), 5000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sync failed');
    } finally {
      setLoading(false);
    }
  };

  const queryRoots = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('http://localhost:8080/v1/taproot-assets/universe/roots');
      if (!response.ok) throw new Error('Failed to query roots');

      const data = await response.json();
      setRoots(data);
      setSuccess('Roots loaded successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to query roots');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <h2 style={{ color: '#ffffff', marginBottom: '10px', textAlign: 'center' }}>
        🌐 Universe Explorer
      </h2>
      <p style={{ color: '#a0a0a0', textAlign: 'center', marginBottom: '30px', fontSize: '14px' }}>
        Manage universe federation, sync assets, and explore the global asset universe
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

      {/* Universe Statistics */}
      <div style={{
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '12px',
        padding: '25px',
        marginBottom: '25px'
      }}>
        <h3 style={{ color: '#ffffff', marginBottom: '20px', fontSize: '18px' }}>
          📊 Universe Statistics
        </h3>

        {stats ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '15px'
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
        ) : (
          <div style={{ textAlign: 'center', padding: '40px', color: '#a0a0a0' }}>
            Loading statistics...
          </div>
        )}

        <button
          onClick={loadStats}
          style={{
            width: '100%',
            marginTop: '20px',
            background: 'rgba(255,255,255,0.1)',
            color: '#ffffff',
            border: '1px solid rgba(255,255,255,0.2)',
            padding: '12px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600'
          }}
        >
          🔄 Refresh Stats
        </button>
      </div>

      {/* Federation & Sync */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '25px' }}>
        {/* Federation Servers */}
        <div style={{
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '12px',
          padding: '25px'
        }}>
          <h3 style={{ color: '#ffffff', marginBottom: '15px', fontSize: '18px' }}>
            🔗 Federation Servers
          </h3>

          <div style={{ marginBottom: '20px', maxHeight: '200px', overflowY: 'auto' }}>
            {servers.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '20px', color: '#a0a0a0', fontSize: '14px' }}>
                No federation servers
              </div>
            ) : (
              servers.map((server, idx) => (
                <div
                  key={idx}
                  style={{
                    background: 'rgba(0,0,0,0.3)',
                    padding: '12px',
                    borderRadius: '8px',
                    marginBottom: '10px',
                    fontSize: '13px'
                  }}
                >
                  <div style={{ color: '#00ff41', fontFamily: 'monospace', marginBottom: '5px' }}>
                    {server.host}
                  </div>
                  <div style={{ color: '#a0a0a0', fontSize: '11px' }}>
                    ID: {server.id}
                  </div>
                </div>
              ))
            )}
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', color: '#a0a0a0', marginBottom: '8px', fontSize: '13px' }}>
              Server Host
            </label>
            <input
              type="text"
              value={newServerHost}
              onChange={(e) => setNewServerHost(e.target.value)}
              placeholder="testnet.universe.lightning.finance:10029"
              style={{
                width: '100%',
                padding: '10px',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '6px',
                color: '#ffffff',
                fontSize: '13px',
                fontFamily: 'monospace'
              }}
            />
          </div>

          <button
            onClick={addServer}
            disabled={loading}
            style={{
              width: '100%',
              background: loading ? 'rgba(255,255,255,0.1)' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: '#ffffff',
              border: 'none',
              padding: '12px',
              borderRadius: '8px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              opacity: loading ? 0.6 : 1
            }}
          >
            {loading ? '⏳ Adding...' : '➕ Add Server'}
          </button>
        </div>

        {/* Universe Sync */}
        <div style={{
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '12px',
          padding: '25px'
        }}>
          <h3 style={{ color: '#ffffff', marginBottom: '15px', fontSize: '18px' }}>
            🔄 Universe Sync
          </h3>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', color: '#a0a0a0', marginBottom: '8px', fontSize: '13px' }}>
              Universe Host
            </label>
            <input
              type="text"
              value={syncHost}
              onChange={(e) => setSyncHost(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '6px',
                color: '#ffffff',
                fontSize: '13px',
                fontFamily: 'monospace'
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', color: '#a0a0a0', marginBottom: '8px', fontSize: '13px' }}>
              Sync Mode
            </label>
            <select
              value={syncMode}
              onChange={(e) => setSyncMode(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '6px',
                color: '#ffffff',
                fontSize: '13px'
              }}
            >
              <option value="SYNC_ISSUANCE_ONLY">Issuance Only</option>
              <option value="SYNC_FULL">Full Sync</option>
            </select>
          </div>

          <button
            onClick={syncUniverse}
            disabled={loading}
            style={{
              width: '100%',
              background: loading ? 'rgba(255,255,255,0.1)' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: '#ffffff',
              border: 'none',
              padding: '12px',
              borderRadius: '8px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              opacity: loading ? 0.6 : 1,
              marginBottom: '15px'
            }}
          >
            {loading ? '⏳ Syncing...' : '🔄 Sync Now'}
          </button>

          <div style={{
            background: 'rgba(102, 126, 234, 0.1)',
            border: '1px solid rgba(102, 126, 234, 0.3)',
            borderRadius: '6px',
            padding: '12px',
            fontSize: '12px',
            color: '#a0a0a0'
          }}>
            ℹ️ Sync assets from a universe server to discover and verify assets
          </div>
        </div>
      </div>

      {/* Universe Roots */}
      <div style={{
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '12px',
        padding: '25px'
      }}>
        <h3 style={{ color: '#ffffff', marginBottom: '15px', fontSize: '18px' }}>
          🌳 Universe Roots
        </h3>

        <button
          onClick={queryRoots}
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
          {loading ? '⏳ Querying...' : '🌳 Query Universe Roots'}
        </button>

        {roots && (
          <div style={{
            background: 'rgba(0,0,0,0.3)',
            padding: '15px',
            borderRadius: '8px',
            maxHeight: '300px',
            overflowY: 'auto'
          }}>
            <pre style={{
              color: '#00ff41',
              fontFamily: 'monospace',
              fontSize: '12px',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-all',
              margin: 0
            }}>
              {JSON.stringify(roots, null, 2)}
            </pre>
          </div>
        )}

        {!roots && (
          <div style={{ textAlign: 'center', padding: '40px', color: '#a0a0a0', fontSize: '14px' }}>
            Query roots to view the universe Merkle tree
          </div>
        )}
      </div>
    </div>
  );
}
