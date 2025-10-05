import { useTransfers } from '../hooks/useTransfers';

export function TransferHistory() {
  const { transfers, loading, error } = useTransfers();

  if (loading && transfers.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '60px', color: '#a0a0a0' }}>
        <div style={{ fontSize: '48px', marginBottom: '20px', opacity: 0.6 }}>⏳</div>
        <div style={{ fontSize: '15px' }}>Loading transfer history...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h2 style={{ color: '#ffffff', marginBottom: '10px', textAlign: 'center' }}>
          📜 Transfer History
        </h2>
        <p style={{ color: '#a0a0a0', textAlign: 'center', marginBottom: '30px', fontSize: '14px' }}>
          Track all asset transfers and transactions
        </p>
        <div style={{
          background: 'rgba(255, 68, 68, 0.1)',
          border: '1px solid rgba(255, 68, 68, 0.3)',
          borderRadius: '12px',
          padding: '30px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '15px' }}>⚠️</div>
          <h3 style={{ color: '#ff4444', marginBottom: '10px', fontSize: '18px' }}>Error Loading Transfers</h3>
          <p style={{ color: '#a0a0a0', fontSize: '14px' }}>{error}</p>
        </div>
      </div>
    );
  }

  if (transfers.length === 0) {
    return (
      <div>
        <h2 style={{ color: '#ffffff', marginBottom: '10px', textAlign: 'center' }}>
          📜 Transfer History
        </h2>
        <p style={{ color: '#a0a0a0', textAlign: 'center', marginBottom: '15px', fontSize: '14px' }}>
          Track all asset transfers and transactions
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
            <li>Transfer history automatically updates when you send or receive assets</li>
            <li>Each transfer shows transaction details, block height, and fees</li>
            <li>Click on any transfer to view detailed information</li>
            <li>All transfers are cryptographically verified on Bitcoin</li>
          </ol>
        </div>

        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          background: 'rgba(0,0,0,0.2)',
          borderRadius: '12px',
          border: '2px dashed rgba(255,255,255,0.1)'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '15px', opacity: 0.6 }}>📜</div>
          <div style={{ color: '#a0a0a0', fontSize: '15px', marginBottom: '10px' }}>
            No transfer history yet
          </div>
          <div style={{ color: '#666', fontSize: '13px' }}>
            Your transaction history will appear here once you send or receive assets
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 style={{ color: '#ffffff', marginBottom: '10px', textAlign: 'center' }}>
        📜 Transfer History
      </h2>
      <p style={{ color: '#a0a0a0', textAlign: 'center', marginBottom: '15px', fontSize: '14px' }}>
        Track all asset transfers and transactions
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
            About Transfer History
          </h3>
        </div>
        <div style={{ color: '#a0a0a0', fontSize: '14px', lineHeight: '1.7' }}>
          <p style={{ marginBottom: '15px', color: '#c0c0c0' }}>
            Transfer history provides a complete audit trail of all asset movements:
          </p>
          <div style={{ display: 'grid', gap: '12px', marginBottom: '15px' }}>
            <div style={{
              background: 'rgba(0, 255, 65, 0.05)',
              padding: '12px 15px',
              borderRadius: '8px',
              border: '1px solid rgba(0, 255, 65, 0.15)'
            }}>
              <div style={{ color: '#00ff41', fontWeight: '600', marginBottom: '4px', fontSize: '14px' }}>
                📥 Received Transfers
              </div>
              <div style={{ fontSize: '13px' }}>
                Assets received from other users or addresses
              </div>
            </div>
            <div style={{
              background: 'rgba(102, 126, 234, 0.05)',
              padding: '12px 15px',
              borderRadius: '8px',
              border: '1px solid rgba(102, 126, 234, 0.15)'
            }}>
              <div style={{ color: '#667eea', fontWeight: '600', marginBottom: '4px', fontSize: '14px' }}>
                📤 Sent Transfers
              </div>
              <div style={{ fontSize: '13px' }}>
                Assets sent to other users or addresses
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
            <strong style={{ color: '#667eea' }}>💡 Pro Tip:</strong> All transfers are anchored to Bitcoin transactions, providing cryptographic proof of ownership and transfer history.
            Block confirmations ensure finality.
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
          <li>Transfer history automatically updates when you send or receive assets</li>
          <li>Each transfer shows transaction details, block height, and fees</li>
          <li>Hover over transfers to highlight them</li>
          <li>All transfers are cryptographically verified on Bitcoin</li>
        </ol>
      </div>

      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <h3 style={{ color: '#ffffff', margin: 0, fontSize: '18px' }}>
          📊 Transaction Log
        </h3>
        <div style={{
          background: 'rgba(102, 126, 234, 0.2)',
          padding: '6px 14px',
          borderRadius: '20px',
          fontSize: '13px',
          color: '#667eea',
          fontWeight: '700'
        }}>
          {transfers.length} transfer{transfers.length !== 1 ? 's' : ''}
        </div>
      </div>

      <div style={{ display: 'grid', gap: '15px' }}>
        {transfers.map((transfer, index) => {
          const timestamp = transfer.transfer_timestamp
            ? new Date(parseInt(transfer.transfer_timestamp) * 1000).toLocaleString()
            : 'Unknown';

          const txHash = transfer.anchor_tx_hash || 'N/A';
          const blockHeight = transfer.anchor_tx_height_hint || 'Pending';
          const chainFees = transfer.anchor_tx_chain_fees || '0';
          const numInputs = transfer.inputs?.length || 0;
          const numOutputs = transfer.outputs?.length || 0;

          return (
            <div
              key={index}
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '12px',
                padding: '20px',
                transition: 'all 0.3s',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
              }}
            >
              {/* Header */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '15px'
              }}>
                <div>
                  <div style={{
                    display: 'inline-block',
                    background: 'rgba(0, 255, 65, 0.2)',
                    color: '#00ff41',
                    padding: '4px 12px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: '600',
                    marginBottom: '8px'
                  }}>
                    {numInputs > 0 && numOutputs > 0 ? '↔️ Transfer' : numOutputs > 0 ? '📤 Sent' : '📥 Received'}
                  </div>
                  <div style={{ color: '#a0a0a0', fontSize: '13px' }}>
                    {timestamp}
                  </div>
                </div>
                <div style={{
                  textAlign: 'right',
                  color: '#ffffff',
                  fontSize: '14px',
                  fontWeight: '600'
                }}>
                  Block: {blockHeight}
                </div>
              </div>

              {/* Transaction Details */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '15px',
                marginBottom: '15px'
              }}>
                <div>
                  <div style={{ color: '#a0a0a0', fontSize: '12px', marginBottom: '4px' }}>
                    Inputs
                  </div>
                  <div style={{ color: '#ffffff', fontSize: '16px', fontWeight: '600' }}>
                    {numInputs}
                  </div>
                </div>
                <div>
                  <div style={{ color: '#a0a0a0', fontSize: '12px', marginBottom: '4px' }}>
                    Outputs
                  </div>
                  <div style={{ color: '#ffffff', fontSize: '16px', fontWeight: '600' }}>
                    {numOutputs}
                  </div>
                </div>
              </div>

              {/* TX Hash */}
              <div style={{
                background: 'rgba(0,0,0,0.3)',
                padding: '12px',
                borderRadius: '8px',
                marginBottom: '12px'
              }}>
                <div style={{ color: '#a0a0a0', fontSize: '11px', marginBottom: '5px' }}>
                  TX HASH
                </div>
                <div style={{
                  color: '#00ff41',
                  fontFamily: 'monospace',
                  fontSize: '12px',
                  wordBreak: 'break-all'
                }}>
                  {txHash}
                </div>
              </div>

              {/* Chain Fees */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingTop: '12px',
                borderTop: '1px solid rgba(255,255,255,0.1)'
              }}>
                <span style={{ color: '#a0a0a0', fontSize: '13px' }}>Chain Fees</span>
                <span style={{ color: '#ffffff', fontSize: '13px', fontWeight: '600' }}>
                  {chainFees} sats
                </span>
              </div>

              {/* Anchor Points */}
              {(transfer.old_anchor_point || transfer.new_anchor_point) && (
                <div style={{
                  marginTop: '15px',
                  padding: '12px',
                  background: 'rgba(255,255,255,0.03)',
                  borderRadius: '6px',
                  fontSize: '11px'
                }}>
                  {transfer.old_anchor_point && (
                    <div style={{ marginBottom: '8px' }}>
                      <span style={{ color: '#a0a0a0' }}>From: </span>
                      <span style={{ color: '#00ff41', fontFamily: 'monospace' }}>
                        {transfer.old_anchor_point.substring(0, 20)}...
                      </span>
                    </div>
                  )}
                  {transfer.new_anchor_point && (
                    <div>
                      <span style={{ color: '#a0a0a0' }}>To: </span>
                      <span style={{ color: '#00ff41', fontFamily: 'monospace' }}>
                        {transfer.new_anchor_point.substring(0, 20)}...
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
