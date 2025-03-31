import React, { useState } from 'react';
import './App.css';

// Import JSON data
import tarotCards from './tarot_cards.json';
import vouchers from './vouchers.json';
import planetCards from './planet_cards.json';
import jokers from './balatro_jokers.json';
import spectral from './spectral.json';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCard, setSelectedCard] = useState(null);

  // Normalize each card so that it has a common "name", "type", and "image_url"
  const normalizeCard = (card) => {
    // Determine the display name:
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
    // Normalize image URL: if missing, fallback to a placeholder
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

  // Live filtering (ignores cards missing a name)
  const filteredCards = combinedData.filter((card) =>
    card.name && card.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Helper to display the card's name (which is normalized)
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
    description: "Description",
    note: "Note"
  };

  return (
    <div className="App">
      <h1>Card Gallery</h1>
      <input
        type="text"
        placeholder="Search cards..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-bar"
      />
      <div className="card-container">
        {filteredCards.map((card, index) => (
          <div
            key={index}
            className="card"
            onClick={() => setSelectedCard(card)}
          >
            <img
              src={card.image_url}
              alt={displayName(card)}
              className="card-image"
            />
            <p>{displayName(card)}</p>
          </div>
        ))}
      </div>

      {selectedCard && (
        <div className="card-details">
          <button className="close-btn" onClick={() => setSelectedCard(null)}>Close</button>
          <h2>{selectedCard.name}</h2>
          <img
            src={selectedCard.image_url}
            alt={selectedCard.name}
            className="details-image"
          />
          <p><strong>{keyLabels.type}:</strong> {selectedCard.type}</p>
          {/* Display all additional fields except the ones we've normalized */}
          <div className="card-info">
            {Object.entries(selectedCard).map(([key, value]) => {
              if (['image_url', 'name', 'type'].includes(key)) return null;
              const label = keyLabels[key] || key; // Use custom label if available
              return (
                <p key={key}><strong>{label}:</strong> {value}</p>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
