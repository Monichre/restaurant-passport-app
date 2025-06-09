#!/bin/bash

# Hybrid Restaurant Data Scraper
# This script runs the hybrid scraper that uses both Firecrawl and Puppeteer

echo "=== Hybrid Restaurant Data Scraper ==="
echo "This scraper uses both Firecrawl and Puppeteer for improved extraction."

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "Error: npm is not installed. Please install Node.js and npm first."
    exit 1
fi

# Navigate to the project root
cd "$(dirname "$0")/.."
npm install

# Check for Firecrawl API key
if [ -z "$FIRECRAWL_API_KEY" ]; then
    echo "⚠️ Warning: FIRECRAWL_API_KEY environment variable is not set."
    echo "The scraper will fall back to using only Puppeteer."
    echo "For better results, set your Firecrawl API key:"
    echo "  export FIRECRAWL_API_KEY=your-api-key"
    echo ""
    read -p "Do you want to continue without Firecrawl? (y/n): " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Exiting."
        exit 1
    fi
else
    echo "✅ Firecrawl API key found."
fi

echo "Starting the hybrid scraper..."
echo "This may take some time depending on the number of restaurants."
echo "Results will be saved to hybrid-restaurant-data.json"

# Run the hybrid scraper
node scripts/hybrid-scraper.js

echo "Scraper completed!"
if [ -f "hybrid-restaurant-data.json" ]; then
    echo "Results saved to hybrid-restaurant-data.json"
    
    # Get quick stats
    TOTAL_RESTAURANTS=$(grep -o '"totalScraped":' hybrid-restaurant-data.json | wc -l)
    VALID_RESULTS=$(grep -o '"validResults":' hybrid-restaurant-data.json | wc -l)
    
    echo "Total restaurants processed: $TOTAL_RESTAURANTS"
    echo "Valid results obtained: $VALID_RESULTS"
    
    # Show extraction method stats if available
    FIRECRAWL_COUNT=$(grep -o '"firecrawl":' hybrid-restaurant-data.json | wc -l)
    PUPPETEER_COUNT=$(grep -o '"puppeteer":' hybrid-restaurant-data.json | wc -l)
    
    if [ $FIRECRAWL_COUNT -gt 0 ] || [ $PUPPETEER_COUNT -gt 0 ]; then
        echo "Extraction method statistics:"
        [ $FIRECRAWL_COUNT -gt 0 ] && echo "  - Firecrawl: $FIRECRAWL_COUNT"
        [ $PUPPETEER_COUNT -gt 0 ] && echo "  - Puppeteer: $PUPPETEER_COUNT"
    fi
else
    echo "Error: hybrid-restaurant-data.json was not created. Check the logs for errors."
fi

# Make the script executable
chmod +x "$0" 