// Reward points calculation logic

const calculatePoints = (amount, fuelType, fuelDensity = null) => {
  // Base calculation: ₹300 = 1 point
  let basePoints = Math.floor(amount / 300);
  
  // Petrol: bonus based on density (higher quality = more points)
  if (fuelType === 'petrol' && fuelDensity) {
    if (fuelDensity >= 0.75) {
      basePoints += Math.floor(basePoints * 0.2); // 20% bonus for high-quality petrol
    }
  }
  
  // Diesel: higher slab bonus
  if (fuelType === 'diesel') {
    if (amount >= 500) {
      basePoints += 2; // Bonus points for diesel ≥ ₹500
    }
  }
  
  // Ensure minimum 1 point for purchases ≥ ₹300
  return Math.max(basePoints, amount >= 300 ? 1 : 0);
};

module.exports = {
  calculatePoints
};