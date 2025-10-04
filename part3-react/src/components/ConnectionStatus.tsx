interface ConnectionStatusProps {
  connected: boolean;
  error?: string | null;
}

export function ConnectionStatus({ connected, error }: ConnectionStatusProps) {
  return (
    <div style={{
      padding: '16px 24px',
      borderRadius: '12px',
      marginBottom: '24px',
      background: connected
        ? 'linear-gradient(135deg, rgba(0, 255, 65, 0.1) 0%, rgba(0, 200, 50, 0.05) 100%)'
        : 'linear-gradient(135deg, rgba(255, 68, 68, 0.1) 0%, rgba(200, 50, 50, 0.05) 100%)',
      border: connected
        ? '1px solid rgba(0, 255, 65, 0.3)'
        : '1px solid rgba(255, 68, 68, 0.3)',
      fontWeight: '600',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      boxShadow: connected
        ? '0 4px 20px rgba(0, 255, 65, 0.1)'
        : '0 4px 20px rgba(255, 68, 68, 0.1)',
      transition: 'all 0.3s ease'
    }}>
      <span style={{
        width: '12px',
        height: '12px',
        borderRadius: '50%',
        backgroundColor: connected ? '#00ff41' : '#ff4444',
        animation: 'pulse 2s infinite',
        boxShadow: connected
          ? '0 0 12px rgba(0, 255, 65, 0.6)'
          : '0 0 12px rgba(255, 68, 68, 0.6)'
      }} />
      <span style={{
        color: connected ? '#00ff41' : '#ff4444',
        fontSize: '15px',
        textShadow: connected
          ? '0 0 8px rgba(0, 255, 65, 0.3)'
          : '0 0 8px rgba(255, 68, 68, 0.3)'
      }}>
        {connected ? '✓ Gateway Connected' : `✗ ${error || 'Gateway Disconnected'}`}
      </span>
    </div>
  );
}