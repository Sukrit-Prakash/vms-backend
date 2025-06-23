import React from "react";

export default function ModelResults({ results }) {
  const getModelIcon = (modelName) => {
    switch (modelName) {
      case 'coco_detector': return '🔍';
      case 'defect_analyzer': return '🔧';
      case 'simple_classifier': return '📊';
      default: return '🤖';
    }
  };

  const formatOutput = (output) => {
    if (typeof output === 'object') {
      return JSON.stringify(output, null, 2);
    }
    return String(output);
  };

  const getModelDisplayName = (modelName) => {
    switch (modelName) {
      case 'coco_detector': return 'COCO Detector';
      case 'defect_analyzer': return 'Defect Analyzer';
      case 'simple_classifier': return 'Simple Classifier';
      default: return modelName;
    }
  };

  if (!results.length) {
    return (
      <div className="card">
        <h2>📊 Model Outputs</h2>
        <div className="empty-state">
          <h3>No Results Yet</h3>
          <p>Start a stream to see real-time model outputs.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <h2>📊 Model Outputs</h2>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ minWidth: '600px' }}>
          <thead>
            <tr>
              <th style={{ width: '20%' }}>Model</th>
              <th style={{ width: '20%' }}>Time</th>
              <th style={{ width: '60%' }}>Output</th>
            </tr>
          </thead>
          <tbody>
            {results.map((r) => (
              <tr key={r.id}>
                <td style={{ width: '20%' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span>{getModelIcon(r.model_name)}</span>
                    <strong>{getModelDisplayName(r.model_name)}</strong>
                  </div>
                </td>
                <td style={{ width: '20%' }}>
                  <div style={{ fontSize: '0.875rem', color: '#718096' }}>
                    {new Date(r.timestamp * 1000).toLocaleString()}
                  </div>
                </td>
                <td style={{ width: '60%', maxWidth: '400px' }}>
                  <div style={{ 
                    maxWidth: '400px',
                    overflow: 'hidden'
                  }}>
                    <pre style={{ 
                      margin: 0, 
                      fontSize: "0.75rem",
                      maxHeight: '120px',
                      overflow: 'auto',
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
                      backgroundColor: '#f7fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: '6px',
                      padding: '0.5rem'
                    }}>
                      {formatOutput(r.output)}
                    </pre>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 