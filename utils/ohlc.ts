export type OHLCData = {
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  timestamp: number;
};

export type Candlestick = {
  timestamp: number;
  price: number;
  volume: number;
};
// Utility functions
export const roundToMinute = (timestamp: number) =>
  Math.floor(timestamp / 60000) * 60000;

export const roundToFiveMinutes = (timestamp: number) =>
  Math.floor(timestamp / (60000 * 5)) * (60000 * 5);

export const calculateOHLC = (ticks: Candlestick[]): OHLCData =>
  ({
    open: ticks[0].price,
    high: Math.max(...ticks.map((t) => t.price)),
    low: Math.min(...ticks.map((t) => t.price)),
    close: ticks[ticks.length - 1].price,
    volume: ticks.reduce((sum, t) => sum + t.volume, 0),
  } as unknown as OHLCData);

export const groupByInterval = (ticks: Candlestick[], roundFn: any) =>
  ticks.reduce((acc: any, tick) => {
    const timeKey = roundFn(tick.timestamp);
    if (!acc[timeKey]) acc[timeKey] = [];
    acc[timeKey].push(tick);
    return acc;
  }, {});
