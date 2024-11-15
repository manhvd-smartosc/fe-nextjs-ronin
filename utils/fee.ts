import Big from 'big.js';

export const calculateLastMCap = (
  marketCapInWei: string,
  roninPrice: number,
) => {
  if (roninPrice) {
    const marketCapBig = new Big(marketCapInWei || 0).div(new Big(10).pow(18));
    const roninPriceBig = new Big(roninPrice);
    const result = marketCapBig.times(roninPriceBig).round(0);

    return result;
  }
  return '0';
};
