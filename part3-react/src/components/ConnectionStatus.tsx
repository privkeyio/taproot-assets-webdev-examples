interface ConnectionStatusProps {
  connected: boolean;
  error?: string | null;
}

export function ConnectionStatus({ connected, error }: ConnectionStatusProps) {
  return (
    <div style={{
      padding: '12px 20px',
      borderRadius: '8px',
      marginBottom: '20px',
      backgroundColor: connected ? 'rgba(72, 187, 120, 0.15)' : 'rgba(245, 101, 101, 0.15)',
      color: connected ? '#c8e6c9' : '#ffb3b3',
      border: connected ? '1px solid rgba(72, 187, 120, 0.3)' : '1px solid rgba(245, 101, 101, 0.3)',
      fontWeight: '600',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    }}>
      <span style={{
        width: '8px',
        height: '8px',
        borderRadius: '50%',
        backgroundColor: connected ? '#48bb78' : '#f56565',
        animation: 'pulse 2s infinite'
      }} />
      {connected ? 'Gateway Connected' : error || 'Gateway Disconnected'}
    </div>
  );
}