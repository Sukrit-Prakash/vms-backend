import React from "react";

export default function Alerts({ results }) {
  const generateAlerts = (results) => {
    const alerts = [];
    
    results.forEach((r) => {
      // Parse the JSON output if it's a string
      let output;
      try {
        output = typeof r.output === 'string' ? JSON.parse(r.output) : r.output;
      } catch (e) {
        console.error('Failed to parse output:', e);
        return;
      }

      // Alert for low confidence in simple_classifier
      if (r.model_name === "simple_classifier" && output.confidence < 0.5) {
        alerts.push({
          id: r.id,
          type: 'warning',
          model: r.model_name,
          timestamp: r.timestamp,
          message: `Low confidence detection: ${output.predicted_class} (${(output.confidence * 100).toFixed(1)}%)`,
          output: output
        });
      }
      
      // Alert for defect detection
      if (r.model_name === "defect_analyzer" && output.status === "defect") {
        alerts.push({
          id: r.id,
          type: 'error',
          model: r.model_name,
          timestamp: r.timestamp,
          message: `Defect detected with score: ${output.defect_score}`,
          output: output
        });
      }
      
      // Alert for high confidence detections in COCO
      if (r.model_name === "coco_detector" && Array.isArray(output) && output.length > 0) {
        const highConfidence = output.filter(detection => detection.score > 0.8);
        if (highConfidence.length > 0) {
          alerts.push({
            id: r.id,
            type: 'info',
            model: r.model_name,
            timestamp: r.timestamp,
            message: `High confidence objects detected: ${highConfidence.length} items`,
            output: output
          });
        }
      }
    });
    
    return alerts;
  };

  const alerts = generateAlerts(results);

  if (!alerts.length) {
    return (
      <div className="card">
        <h2>🚨 Alerts</h2>
        <div className="empty-state">
          <h3>All Clear</h3>
          <p>No alerts detected. Everything is running normally.</p>
        </div>
      </div>
    );
  }

  const getAlertIcon = (type) => {
    switch (type) {
      case 'error': return '🔴';
      case 'warning': return '🟡';
      case 'info': return '🔵';
      default: return '⚪';
    }
  };

  const getAlertClass = (type) => {
    switch (type) {
      case 'error': return 'alert-error';
      case 'warning': return 'alert-warning';
      case 'info': return 'alert-info';
      default: return '';
    }
  };

  return (
    <div className="card alert">
      <h2>🚨 Alerts ({alerts.length})</h2>
      <div style={{ maxHeight: '400px', overflow: 'auto' }}>
        {alerts.map((alert) => (
          <div 
            key={alert.id} 
            className={`alert-item ${getAlertClass(alert.type)}`}
            style={{
              padding: '1rem',
              margin: '0.5rem 0',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              background: alert.type === 'error' ? '#fed7d7' : 
                         alert.type === 'warning' ? '#fef5e7' : '#ebf8ff'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.2rem' }}>{getAlertIcon(alert.type)}</span>
              <div style={{ flex: 1 }}>
                <div style={{ 
                  fontWeight: '600', 
                  marginBottom: '0.25rem',
                  color: alert.type === 'error' ? '#c53030' : 
                         alert.type === 'warning' ? '#d69e2e' : '#2b6cb0'
                }}>
                  {alert.message}
                </div>
                <div style={{ 
                  fontSize: '0.875rem', 
                  color: '#718096',
                  marginBottom: '0.5rem'
                }}>
                  {new Date(alert.timestamp * 1000).toLocaleString()} • {alert.model}
                </div>
                <pre style={{ 
                  margin: 0, 
                  fontSize: "0.75rem",
                  background: 'rgba(255,255,255,0.5)',
                  padding: '0.5rem',
                  borderRadius: '4px',
                  maxHeight: '100px',
                  overflow: 'auto'
                }}>
                  {JSON.stringify(alert.output, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 