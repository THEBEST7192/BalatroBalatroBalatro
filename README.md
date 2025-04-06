# Jimbo Helper

A comprehensive companion application for the Balatro card game.

## Description

Jimbo Helper is a web-based companion application that provides detailed information about various card types and game mechanics in the Balatro card game. The application includes data for:
- Jokers
- Tarot Cards
- Planet Cards
- Vouchers
- Spectral Cards
- Blinds and Antes

## Features

- Comprehensive card database with detailed information
- High-quality card images
- Game mechanics reference
- Modern UI built with React
- Easy-to-navigate interface
- RNG for a variety of purposes

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm (comes with Node.js)

### Installation

1. Clone the repository
```bash
git clone https://github.com/THEBEST7192/Jimbo-Helper
cd Jimbo-Helper
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run start
```

The application will be available at `http://localhost:3000` or whatever port is specified in the development server.

### Data Setup

The application uses pre-scraped data from the Balatro game wiki. The data is stored in JSON files:
- `balatro_jokers.json` - Joker cards information
- `tarot_cards.json` - Tarot cards information
- `planet_cards.json` - Planet cards information
- `vouchers.json` - Voucher cards information
- `spectral.json` - Spectral cards information
- `blind.json` - Blinds and Antes information

#### Scraper Setup

The scraper is a Python utility that fetches and processes game data from the Balatro game wiki. To use the scraper:

1. Install the required Python packages:
```bash
pip install -r Scraper/requirements.txt
```

2. Run the scraper:
```bash
python Scraper/Scraper.py
```

The scraper will automatically:
- Process and clean the data
- Save the data to corresponding JSON files
- Handle image URLs to ensure accessibility
- Handle errors gracefully with informative messages

If you need to update the data, run the Python scraper.

## Usage

The application provides a user-friendly interface to:

1. Browse and search through all card types
2. View detailed information about each card, including:
   - Card name
   - Card type
   - Card effects
   - Costs
   - Unlock requirements
   - Activation methods
3. View detailed information about blinds and antes
4. Randomly select cards and blinds
5. Randomly choose if a thing should happen or not
6. Access high-quality card images

## Project Structure

- `app.jsx` - Main application component
- `Scraper.py` - Data scraping utility
- Various `.json` files - Game data storage
- `node_modules` - Project dependencies

## Technologies Used

- React
- Python (for data scraping)

## License

This project is intended for personal use and learning purposes.

## Last Updated

2025-04-05