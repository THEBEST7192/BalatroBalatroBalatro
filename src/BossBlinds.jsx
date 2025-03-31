// BossBlinds.jsx
import React, { useState } from 'react';
import './App.css';

// Import Boss Blinds JSON data
import bossBlinds from './blind.json';
  // Function to highlight keywords in the text
  const highlightText = (text) => {
    if (!text) return text;
    const multPattern = /\+\d+\s*(mult|Mult|multiplication|Multiplication)\b/gi;
    const xmultPattern = /x\d+\s*(mult|Mult|multiplication|Multiplication)\b/gi;
    const chipPattern = /\+\d+\s*(chip|Chip|chips|Chips)\b/gi;
    const dollarPattern = /\$\d+/g;
    // Card suits
    const heartsPattern = /\b(heart|Heart|hearts|Hearts)\b/gi;
    const diamondsPattern = /\b(diamond|Diamond|diamonds|Diamonds)\b/gi;
    const clubsPattern = /\b(club|Club|clubs|Clubs)\b/gi;
    const spadesPattern = /\b(spade|Spade|spades|Spades)\b/gi;

    // Card rarity
    const uncommonRarity = /\b(uncommon|Uncommon)\b/gi;
    const commonRarity = /\b(common|Common)\b/gi; 
    const rareRarity = /\b(rare|Rare)\b/gi;
    const legendaryRarity = /\b(legendary|Legendary)\b/gi;

    // Card type
    const tarotType = /\b(tarot|Tarot|tarots|Tarots|tarotCards)\b/gi;
    const planetType = /\b(planet|Planet)\b/gi;
    const voucherType = /\b(voucher|Voucher|Base Voucher|Upgraded Voucher)\b/gi;
    const spectralType = /\b(spectral|Spectral)\b/gi;
    
    const highlightedText = text
      // Keywords (plus mult, x mult, chips, $)
      .replace(multPattern, (match) => `<span class="highlight-plusmult">${match}</span>`)
      .replace(xmultPattern, (match) => `<span class="highlight-xmult">${match}</span>`)
      .replace(chipPattern, (match) => `<span class="highlight-chips">${match}</span>`)      
      .replace(dollarPattern, (match) => `<span class="highlight-money">${match}</span>`)
      // Card suits
      .replace(heartsPattern, (match) => `<span class="highlight-hearts">${match}</span>`)
      .replace(diamondsPattern, (match) => `<span class="highlight-diamonds">${match}</span>`)
      .replace(clubsPattern, (match) => `<span class="highlight-clubs">${match}</span>`)
      .replace(spadesPattern, (match) => `<span class="highlight-spades">${match}</span>`)
      // Rarity
      .replace(commonRarity, (match) => `<span class="rarity-commonTxt">${match}</span>`)
      .replace(uncommonRarity, (match) => `<span class="rarity-uncommonTxt">${match}</span>`)
      .replace(rareRarity, (match) => `<span class="rarity-rareTxt">${match}</span>`)
      .replace(legendaryRarity, (match) => `<span class="rarity-legendaryTxt">${match}</span>`)
      // Card type
      .replace(tarotType, (match) => `<span class="tarotTxt">${match}</span>`)
      .replace(planetType, (match) => `<span class="planetTxt">${match}</span>`)
      .replace(voucherType, (match) => `<span class="voucherTxt">${match}</span>`)
      .replace(spectralType, (match) => `<span class="spectralTxt">${match}</span>`);
    
    return highlightedText;
  };

  function BossBlinds() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [blindsPerRow, setBlindsPerRow] = useState(8);
  
    // Filter blinds by name
    const filteredBlinds = bossBlinds.filter((blind) =>
      blind.name && blind.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  
    // Select a random blind
    const pickRandomBlind = () => {
      const randomIndex = Math.floor(Math.random() * bossBlinds.length);
      setSelectedIndex(randomIndex);
    };
  
    // Navigate through blinds
    const goToPrevious = () => {
      if (selectedIndex !== null) {
        setSelectedIndex((prevIndex) => (prevIndex - 1 + filteredBlinds.length) % filteredBlinds.length);
      }
    };
  
    const goToNext = () => {
      if (selectedIndex !== null) {
        setSelectedIndex((prevIndex) => (prevIndex + 1) % filteredBlinds.length);
      }
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
          className="blind-container"
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${blindsPerRow}, 1fr)`,
            gap: '15px',
          }}
        >
          {filteredBlinds.map((blind, index) => (
            <div
              key={index}
              className="blind-card"
              onClick={() => setSelectedIndex(index)}
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
  
        {selectedIndex !== null && (
          <div className="blind-details">
            <button className="close-btn" onClick={() => setSelectedIndex(null)}>
              Close
            </button>
            <button className="prev-btn" onClick={goToPrevious}>
              ◀ Prev
            </button>

            <button 
              onClick={pickRandomBlind}>Pick a Random Blind
            </button>

            <button className="next-btn" onClick={goToNext}>
              Next ▶
            </button>
  
            <h2>{filteredBlinds[selectedIndex].name}</h2>
            <img
              src={filteredBlinds[selectedIndex].image_url || 'https://via.placeholder.com/150'}
              alt={filteredBlinds[selectedIndex].name}
              className="details-image"
            />
            <div className="blind-info">
              {filteredBlinds[selectedIndex].description && (
                <div className="blind-info-item">
                  <strong>Description: </strong>
                  <span
                    dangerouslySetInnerHTML={{ __html: highlightText(filteredBlinds[selectedIndex].description) }}
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }
  



export default BossBlinds;
