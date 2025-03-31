// App.jsx
import React, { useState } from 'react';
import './App.css';

// Import JSON data
import tarotCards from './tarot_cards.json';
import vouchers from './vouchers.json';
import planetCards from './planet_cards.json';
import jokers from './balatro_jokers.json';
import spectral from './spectral.json';

// Import the BossBlinds component
import BossBlinds from './BossBlinds';

function App() {
  const [selectedTab, setSelectedTab] = useState("cards");

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCard, setSelectedCard] = useState(null);
  const [cardsPerRow, setCardsPerRow] = useState(8); // slider state

  // Normalize each card so that it has a common "name", "type", and "image_url"
  const normalizeCard = (card) => {
    const name =
      card.name ||
      card.joker ||
      card.planet_card ||
      card.tarot_card ||
      card.spectral_card ||
      "Unnamed";

    let type = "";
    if (card.joker) {
      type = "Joker";
    } else if (card.planet_card) {
      type = "Planet";
    } else if (card.tarot_card) {
      type = "Tarot";
    } else if (card.voucher_type) {
      type = "Voucher";
    } else if (card.spectral_card) {
      type = "Spectral";
    }
    const image_url = card.image_url || 'https://via.placeholder.com/150';
    return { ...card, name, type, image_url };
  };

  // Combine data from all sources and normalize them
  const combinedData = [
    ...jokers.map(normalizeCard),
    ...planetCards.map(normalizeCard),
    ...tarotCards.map(normalizeCard),
    ...vouchers.map(normalizeCard),
    ...spectral.map(normalizeCard),
  ];

  // Select a random blind
  const pickRandomCard = () => {
    const randomIndex = Math.floor(Math.random() * combinedData.length);
    setSelectedCard(combinedData[randomIndex]); // Correctly select a random card
  };
  
  // Navigate through blinds
  const goToPrevious = () => {
    if (selectedCard !== null) {
      const currentIndex = combinedData.findIndex((card) => card.name === selectedCard.name);
      const newIndex = (currentIndex - 1 + combinedData.length) % combinedData.length;
      setSelectedCard(combinedData[newIndex]);
    }
  };
  
  const goToNext = () => {
    if (selectedCard !== null) {
      const currentIndex = combinedData.findIndex((card) => card.name === selectedCard.name);
      const newIndex = (currentIndex + 1) % combinedData.length;
      setSelectedCard(combinedData[newIndex]);
    }
  };
  
  
  // Live filtering
  const filteredCards = combinedData.filter((card) =>
    card.name && card.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Helper for display name
  const displayName = (card) => card.name;

  // Custom key labels for display
  const keyLabels = {
    joker: "Joker",
    effect: "Effect",
    cost: "Cost",
    rarity: "Rarity",
    activation: "Activation",
    unlock_requirement: "Unlock Requirement",
    type: "Type",
    planet_card: "Planet Card",
    tarot_card: "Tarot Card",
    spectral_card: "Spectral Card",
    voucher_type: "Voucher Type",
    note: "Note",
    description: "Description"
  };

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

  // Helper function to determine the card container class based on its type or rarity.
  // For jokers, use the rarity (e.g., rarity-common, rarity-rare). For the rest, use type.
  const getCardClass = (card) => {
    if (card.type === "Joker" && card.rarity) {
      return `card rarity-${card.rarity.toLowerCase()}`;
    }
    return `card ${card.type.toLowerCase()}`;
  };

  return (
    <div className="App">
      <header>
        <h1>Balatro Site</h1>
        <nav>
          <button onClick={() => setSelectedTab("cards")}>Card Gallery</button>
          <button onClick={() => setSelectedTab("bossblinds")}>Boss Blinds</button>
        </nav>
      </header>
      
      {selectedTab === "cards" && (
        <div className="card-gallery">
          <h1>Card Gallery</h1>
          <input
            type="text"
            placeholder="Search cards..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-bar"
          />
          <div className="slider-container">
            <label htmlFor="cardsPerRow">Cards per row: {cardsPerRow}</label>
            <input
              type="range"
              id="cardsPerRow"
              min="5"
              max="30"
              value={cardsPerRow}
              onChange={(e) => setCardsPerRow(parseInt(e.target.value))}
            />
          </div>
          <div
            className={`card-container ${cardsPerRow > 10 ? "compact" : ""}`}
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${cardsPerRow}, 1fr)`,
              gap: '15px'
            }}
          >
            {filteredCards.map((card, index) => (
              <div
                key={index}
                className={getCardClass(card)}
                onClick={() => setSelectedCard(card)}
              >
                <img
                  src={card.image_url}
                  alt={displayName(card)}
                  className="card-image"
                />
                {cardsPerRow <= 10 && <p>{displayName(card)}</p>}
              </div>
            ))}
          </div>

          {selectedCard && (
            <div className="card-details">

              <button className="close-btn" onClick={() => setSelectedCard(null)}>
                Close
              </button>

              <button className="prev-btn" onClick={goToPrevious}>
              ◀ Prev
            </button>

            <button 
              onClick={pickRandomCard}>Pick a Random Card
            </button>

            <button className="next-btn" onClick={goToNext}>
              Next ▶
            </button>

              <h2>{selectedCard.name}</h2>
              <img
                src={selectedCard.image_url}
                alt={selectedCard.name}
                className="details-image"
              />
              <div className="card-info">
                {/* Render the type first */}
                <div className="card-info-item">
                  <strong>{keyLabels.type}:</strong> {selectedCard.type}
                </div>
                {Object.entries(selectedCard).map(([key, value]) => {
                  if (['image_url', 'name', 'type'].includes(key)) return null;
                  if (!value || value.trim() === "") return null;
                  const label = keyLabels[key] || key;
                  return (
                    <div key={key} className="card-info-item">
                      <strong>{label}:</strong>{' '}
                      <span dangerouslySetInnerHTML={{ __html: highlightText(value) }}/>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {selectedTab === "bossblinds" && <BossBlinds />}
    </div>
  );
}

export default App;
