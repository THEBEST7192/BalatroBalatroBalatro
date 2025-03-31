import React, { useState } from 'react';
import './App.css';

function RNGPage() {
  const [result, setResult] = useState('');
  const [doubleOdds, setDoubleOdds] = useState(false);
  const [rollType, setRollType] = useState('glass'); // Default outcome

  const roll = () => {
    const factor = doubleOdds ? 2 : 1;
    const r = Math.random();

    // Switch based on what outcome the user wants to roll for:
    if (rollType === 'glass') {
      if (r < (1 * factor) / 4) {
        setResult('Broken');
      } else {
        setResult('Survived');
      }
    } else if (rollType === 'wheel') {
      if (r < (1 * factor) / 4) {
        const effectRoll = Math.random();
        if (effectRoll < (2 * 1) / 6) {
          setResult('Foil');
        } else if (effectRoll < (4 * 1) / 6) {
          setResult('Holographic');
        } else if (effectRoll < (5 * 1) / 6) {
          setResult('Polychrome');
        } else {
          setResult('Negative');
        }
      } else {
        setResult('Nope');
      }
    } else if (rollType === 'micheal') {
      if (r < (1 * factor) / 6) {
        setResult('Extinct!');
      } else {
        setResult('Survived');
      }
    } else if (rollType === 'cavendish') {
      if (r < (1 * factor) / 1000) {
        setResult('Rip!');
      } else {
        setResult('Survived');
      }
    } else if (rollType === 'bloodstone') {
      if (r < (1 * factor) / 2) {
        setResult('Bloodstone activated');
      } else {
        setResult('No bloodstone for you');
      }
    } else if (rollType === 'misprint') {
        setResult(Math.floor(Math.random() * 24));
    }    
  };

  return (
    <div className="rng-container">
      <h1>RNG Page</h1>
      <label>
        <input
          type="checkbox"
          checked={doubleOdds}
          onChange={() => setDoubleOdds(!doubleOdds)}
        />
        Double Probabilities
      </label>
      <div style={{ margin: '10px 0' }}>
        <label htmlFor="rollType">Roll for: </label>
        <select
          id="rollType"
          value={rollType}
          onChange={(e) => setRollType(e.target.value)}
        >
          <option value="glass">Glass and 8 Ball</option>
          <option value="wheel">Wheel of fortune</option>
          <option value="misprint">Misprint </option>
          <option value="micheal">Gros Micheal</option>
          <option value="cavendish">Cavendish</option>
          <option value="bloodstone">Bloodstone</option>
        </select>
      </div>
      <button onClick={roll}>Roll</button>
      <p>Result: {result}</p>
    </div>
  );
}

export default RNGPage;