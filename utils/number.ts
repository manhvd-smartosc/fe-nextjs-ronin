import Big from 'big.js';

function formatLargeNumber(number: Big): string {
  if (number.gte(new Big(1_000_000_000))) {
    return number.div(new Big(1_000_000_000)).toFixed(2) + 'B'; // Billion
  } else if (number.gte(new Big(1_000_000))) {
    return number.div(new Big(1_000_000)).toFixed(2) + 'M'; // Million
  } else if (number.gte(new Big(1_000))) {
    return number.div(new Big(1_000)).toFixed(2) + 'k'; // Thousand
  }
  return number.toFixed(4).toString(); // Less than 1,000
}

function formatLargeNumberInt(number: Big): string {
  if (number.gte(new Big(1_000_000_000))) {
    return number.div(new Big(1_000_000_000)).round().toString() + 'B'; // Billion
  } else if (number.gte(new Big(1_000_000))) {
    return number.div(new Big(1_000_000)).round().toString() + 'M'; // Million
  } else if (number.gte(new Big(1_000))) {
    return number.div(new Big(1_000)).round().toString() + 'k'; // Thousand
  }
  return number.round().toString(); // Less than 1,000
}

export { formatLargeNumber, formatLargeNumberInt };
