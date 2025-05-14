
// Generates a random starting price between 1000 and 15000
export function generateRandomStartingPrice() {
  return Math.random() * 14000 + 1000;
}

// Generates a random price movement with a bias towards small movements
export function generateRandomPrice(basePrice: number) {
  // Generate volatility: some assets are more volatile than others
  const volatility = 0.002 + (Math.random() * 0.01);
  
  // Calculate price change with slight upwards bias (positive trends shown more often)
  const changePercent = (Math.random() - 0.48) * volatility;
  
  // Apply the change to the base price
  const newPrice = basePrice * (1 + changePercent);
  
  // Ensure price doesn't go below a certain threshold
  return Math.max(50, newPrice);
}

// Generates an array of price data points
export function generatePriceData(numPoints: number) {
  const data = [];
  let currentPrice = generateRandomStartingPrice();
  
  const now = new Date();
  
  // Generate data points starting from the past
  for (let i = 0; i < numPoints; i++) {
    // Calculate time for this point (going backwards from now)
    const timeOffset = (numPoints - i) * 1000; // 1 second intervals
    const pointTime = new Date(now.getTime() - timeOffset);
    
    // Add the point to our data
    data.push({
      time: pointTime,
      price: currentPrice
    });
    
    // Generate the next price
    currentPrice = generateRandomPrice(currentPrice);
  }
  
  return data;
}
