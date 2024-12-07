import { calculateLastMCap } from '@/utils/fee';

describe('calculateLastMCap', () => {
  it('should calculate the market cap correctly when valid inputs are provided', () => {
    const marketCapInWei = '1000000000000000000'; // 1 ETH
    const roninPrice = 2; // $2 per unit
    const result = calculateLastMCap(marketCapInWei, roninPrice);
    expect(result.toString()).toBe('2');
  });

  it('should return "0" when roninPrice is 0 or falsy', () => {
    const marketCapInWei = '1000000000000000000'; // 1 ETH
    const roninPrice = 0; // Ronin price is 0
    const result = calculateLastMCap(marketCapInWei, roninPrice);
    expect(result).toBe('0');
  });

  it('should handle empty or undefined marketCapInWei', () => {
    const marketCapInWei = undefined; // Undefined input
    const roninPrice = 2; // $2 per unit
    const result = calculateLastMCap(marketCapInWei as any, roninPrice);
    expect(result.toString()).toBe('0');
  });

  it('should handle large market cap values without overflow', () => {
    const marketCapInWei = '1000000000000000000000000000000'; // Large value
    const roninPrice = 1.5; // $1.5 per unit
    const result = calculateLastMCap(marketCapInWei, roninPrice);
    expect(result.toString()).toBe('1500000000000');
  });

  it('should round the result to the nearest integer', () => {
    const marketCapInWei = '1000000000000000001'; // Slightly more than 1 ETH
    const roninPrice = 1.5; // $1.5 per unit
    const result = calculateLastMCap(marketCapInWei, roninPrice);
    expect(result.toString()).toBe('2'); // Rounded up
  });
});
