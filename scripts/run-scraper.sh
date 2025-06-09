#!/bin/bash

# Restaurant Data Scraper
# This script installs dependencies and runs the restaurant scraper

echo "=== Restaurant Data Scraper ==="
echo "Installing dependencies..."

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "Error: npm is not installed. Please install Node.js and npm first."
    exit 1
fi

# Navigate to the project root to install dependencies
cd "$(dirname "$0")/.."
npm install

echo "Starting the scraper..."
echo "This may take some time depending on the number of restaurants."
echo "Results will be saved to restaurant-data.json"

# Run the scraper
node scripts/scrape-restaurants.js

echo "Scraper completed!"
if [ -f "restaurant-data.json" ]; then
    echo "Results saved to restaurant-data.json"
    
    # Get quick stats
    TOTAL_RESTAURANTS=$(grep -o '"totalScraped":' restaurant-data.json | wc -l)
    VALID_RESULTS=$(grep -o '"validResults":' restaurant-data.json | wc -l)
    
    echo "Total restaurants processed: $TOTAL_RESTAURANTS"
    echo "Valid results obtained: $VALID_RESULTS"
else
    echo "Error: restaurant-data.json was not created. Check the logs for errors."
fi 