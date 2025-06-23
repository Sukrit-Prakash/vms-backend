import React, { useEffect, useState } from "react";
import { fetchStreams, fetchResults, startStream, stopStream } from "./api";
import StreamsList from "./components/StreamsList";
import ModelResults from "./components/ModelResults";
import Alerts from "./components/Alerts";
import "./App.css";

function App() {
  const [streams, setStreams] = useState({});
  const [selectedStream, setSelectedStream] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadStreams();
  }, []);

  const loadStreams = async () => {
    try {
      setLoading(true);
      const data = await fetchStreams();
      setStreams(data);
      setError(null);
    } catch (err) {
      setError("Failed to load streams. Please check if the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedStream) {
      loadResults();
      const interval = setInterval(loadResults, 3000);
      return () => clearInterval(interval);
    }
  }, [selectedStream]);

  const loadResults = async () => {
    try {
      const data = await fetchResults(selectedStream, 10);
      setResults(data);
    } catch (err) {
      console.error("Failed to load results:", err);
    }
  };

  const handleStartStream = async (id) => {
    try {
      await startStream(id);
      await loadStreams();
    } catch (err) {
      console.error("Failed to start stream:", err);
    }
  };

  const handleStopStream = async (id) => {
    try {
      await stopStream(id);
      await loadStreams();
    } catch (err) {
      console.error("Failed to stop stream:", err);
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">
          <h2>Loading VMS Dashboard...</h2>
          <p>Please wait while we connect to the backend.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="card alert">
          <h2>Connection Error</h2>
          <p>{error}</p>
          <button onClick={loadStreams}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="dashboard-header">
        <h1>VMS Dashboard</h1>
        <p>Video Management System - Real-time AI Model Monitoring</p>
      </div>

      <StreamsList
        streams={streams}
        onStart={handleStartStream}
        onStop={handleStopStream}
      />

      <div className="stream-selector">
        <label>
          <span>📹 Select Stream to Monitor:</span>
          <select
            value={selectedStream || ""}
            onChange={(e) => setSelectedStream(e.target.value)}
          >
            <option value="">-- Choose a stream --</option>
            {Object.keys(streams).map((id) => (
              <option key={id} value={id}>
                Stream {id} - {streams[id].url}
              </option>
            ))}
          </select>
        </label>
      </div>

      {selectedStream && (
        <div className="dashboard-grid">
          <ModelResults results={results} />
          <Alerts results={results} />
        </div>
      )}

      {!selectedStream && Object.keys(streams).length > 0 && (
        <div className="empty-state">
          <h3>📊 Ready to Monitor</h3>
          <p>Select a stream above to view real-time model outputs and alerts.</p>
        </div>
      )}

      {Object.keys(streams).length === 0 && (
        <div className="empty-state">
          <h3>🎥 No Streams Available</h3>
          <p>Register a video stream to start monitoring with AI models.</p>
        </div>
      )}
    </div>
  );
}

export default App;
