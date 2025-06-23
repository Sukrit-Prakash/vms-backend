import React from "react";

export default function StreamsList({ streams, onStart, onStop }) {
  const getStatusBadge = (status) => {
    const statusClass = status === 'running' ? 'running' : 
                       status === 'stopped' ? 'stopped' : 'registered';
    return <span className={`status-badge ${statusClass}`}>{status}</span>;
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'running': return '🟢';
      case 'stopped': return '🔴';
      case 'registered': return '🟡';
      default: return '⚪';
    }
  };

  return (
    <div className="card">
      <h2>🎬 Active Streams</h2>
      {Object.keys(streams).length === 0 ? (
        <div className="empty-state">
          <h3>No Streams Registered</h3>
          <p>Use the API to register video streams for monitoring.</p>
        </div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Source</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(streams).map(([id, s]) => (
              <tr key={id}>
                <td>
                  <strong>#{id}</strong>
                </td>
                <td>
                  <div style={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {s.url}
                  </div>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span>{getStatusIcon(s.status)}</span>
                    {getStatusBadge(s.status)}
                  </div>
                </td>
                <td>
                  {s.status !== "running" ? (
                    <button 
                      onClick={() => onStart(id)}
                      style={{ background: 'linear-gradient(135deg, #48bb78, #38a169)' }}
                    >
                      ▶️ Start
                    </button>
                  ) : (
                    <button 
                      onClick={() => onStop(id)}
                      style={{ background: 'linear-gradient(135deg, #e53e3e, #c53030)' }}
                    >
                      ⏹️ Stop
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
} 