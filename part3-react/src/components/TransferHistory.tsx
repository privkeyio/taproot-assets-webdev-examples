import { useTransfers } from '../hooks/useTransfers';

export function TransferHistory() {
  const { transfers, loading, error } = useTransfers();

  if (loading && transfers.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '60px', color: '#a0a0a0' }}>
        <div style={{ fontSize: '48px', marginBottom: '20px' }}>⏳</div>
        Loading transfer history...
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
        <h3 style={{ color: '#ff4444', marginBottom: '10px' }}>Error Loading Transfers</h3>
        <p style={{ color: '#a0a0a0' }}>{error}</p>
      </div>
    );
  }

  if (transfers.length === 0) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '60px',
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '12px',
        color: '#a0a0a0'
      }}>
        <div style={{ fontSize: '48px', marginBottom: '20px' }}>📜</div>
        <h3 style={{ color: '#ffffff', marginBottom: '10px' }}>No Transfers Yet</h3>
        <p>Your transaction history will appear here once you send or receive assets</p>
      </div>
    );
  }

  return (
    <div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <h2 style={{ color: '#ffffff', margin: 0 }}>📜 Transfer History</h2>
        <div style={{
          background: 'rgba(102, 126, 234, 0.2)',
          padding: '8px 16px',
          borderRadius: '20px',
          fontSize: '14px',
          color: '#667eea',
          fontWeight: '600'
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
