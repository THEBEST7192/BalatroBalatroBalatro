// BossBlinds.jsx
import React, { useState } from 'react';
import './App.css';

// Import Boss Blinds JSON data
import bossBlinds from './blind.json';

function BossBlinds() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBlind, setSelectedBlind] = useState(null);
  const [blindsPerRow, setBlindsPerRow] = useState(8);

  // Filter blinds by name
  const filteredBlinds = bossBlinds.filter((blind) =>
    blind.name && blind.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pick a random blind from the list
  const pickRandomBlind = () => {
    const randomBlind = bossBlinds[Math.floor(Math.random() * bossBlinds.length)];
    setSelectedBlind(randomBlind);
  };

  return (
    <div className="BossBlinds">
      <h1>Boss Blinds</h1>
      <div className="banner-controls">
        <button onClick={pickRandomBlind}>Pick a Random Blind</button>
      </div>
      <input
        type="text"
        placeholder="Search blinds..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-bar"
      />
      <div className="slider-container">
        <label htmlFor="blindsPerRow">Blinds per row: {blindsPerRow}</label>
        <input
          type="range"
          id="blindsPerRow"
          min="5"
          max="10"
          value={blindsPerRow}
          onChange={(e) => setBlindsPerRow(parseInt(e.target.value))}
        />
      </div>
      <div
        className={`blind-container ${blindsPerRow > 10 ? "compact" : ""}`}
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${blindsPerRow}, 1fr)`,
          gap: '15px'
        }}
      >
        {filteredBlinds.map((blind, index) => (
          <div
            key={index}
            className="blind-card"
            onClick={() => setSelectedBlind(blind)}
          >
            <img
              src={blind.image_url || 'https://via.placeholder.com/150'}
              alt={blind.name}
              className="blind-image"
            />
            {blindsPerRow <= 10 && <p>{blind.name}</p>}
          </div>
        ))}
      </div>
      {selectedBlind && (
        <div className="blind-details">
          <button className="close-btn" onClick={() => setSelectedBlind(null)}>
            Close
          </button>
          <h2>{selectedBlind.name}</h2>
          <img
            src={selectedBlind.image_url || 'https://via.placeholder.com/150'}
            alt={selectedBlind.name}
            className="details-image"
          />
          <div className="blind-info">
            {selectedBlind.description && (
              <div className="blind-info-item">
                <strong>Description:</strong> {selectedBlind.description}
              </div>
            )}
            {selectedBlind.minimum_ante && (
              <div className="blind-info-item">
                <strong>Minimum Ante:</strong> {selectedBlind.minimum_ante}
              </div>
            )}
            {selectedBlind.score_requirement && (
              <div className="blind-info-item">
                <strong>Score Requirement:</strong> {selectedBlind.score_requirement}
              </div>
            )}
            {selectedBlind.earnings && (
              <div className="blind-info-item">
                <strong>Earnings:</strong> {selectedBlind.earnings}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default BossBlinds;
