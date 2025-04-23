import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await axios.post('http://localhost:5000/check_non_followers', credentials);
      setResults(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="header">
        <h1 className="title">unfollowD</h1>
        <p className="subtitle">Find out who's not following you back on Instagram🤨</p>
      </header>
      
      <main className="main-content">
        {loading ? (
          <div className="loader-container">
            <div className="loader"></div>
            <p>Scanning your followers...</p>
          </div>
        ) : results ? (
          <div className="results-container">
            <div className="results-header">
              <h2>Imposters Found: {results.count}</h2>
              <p>These users aren't following you back:</p>
            </div>
            <div className="results-list">
              {results.non_followers.map((user, i) => (
                <div key={i} className="user-card">
                  <span className="username">@{user}</span>
                </div>
              ))}
            </div>
            <button 
              className="action-button"
              onClick={() => setResults(null)}
            >
              Start New Search
            </button>
          </div>
        ) : (
          <form className="login-form" onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="username">Username</label>
              <input
                id="username"
                type="text"
                placeholder="Enter your Instagram username"
                value={credentials.username}
                onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                placeholder="Enter your Instagram password"
                value={credentials.password}
                onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                required
              />
            </div>
            <button 
              type="submit" 
              className="action-button primary"
            >
              Bust Those Ghosts
            </button>
            {error && <p className="error-message">{error}</p>}
            <div className="disclaimer">
              <p>Your credentials are used only for this session and are not stored.</p>
            </div>
          </form>
        )}
      </main>
      
      <footer className="footer">
        <p> unfollowD &copy; {new Date().getFullYear()} - Find your Instagram ghosts</p>
      </footer>
    </div>
  );
}

export default App;
