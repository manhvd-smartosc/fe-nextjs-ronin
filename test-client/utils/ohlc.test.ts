import {
  roundToMinute,
  roundToFiveMinutes,
  calculateOHLC,
  groupByInterval,
  Candlestick,
  OHLCData,
} from '@/utils/ohlc';

describe('Test OHLC', () => {
  describe('roundToMinute', () => {
    it('should round down the timestamp to the nearest minute', () => {
      const timestamp = 1672531199123; // Example timestamp
      expect(roundToMinute(timestamp)).toBe(1672531140000);
    });
  });

  describe('roundToFiveMinutes', () => {
    it('should round down the timestamp to the nearest 5 minutes', () => {
      const timestamp = 1672531199123; // Example timestamp
      expect(roundToFiveMinutes(timestamp)).toBe(1672530900000);
    });
  });

  describe('calculateOHLC', () => {
    it('should calculate OHLC data correctly from candlestick data', () => {
      const ticks: Candlestick[] = [
        { timestamp: 1672531140000, price: 100, volume: 10 },
        { timestamp: 1672531141000, price: 110, volume: 20 },
        { timestamp: 1672531142000, price: 90, volume: 30 },
        { timestamp: 1672531143000, price: 95, volume: 15 },
      ];
      const expected: OHLCData = {
        open: 100,
        high: 110,
        low: 90,
        close: 95,
        volume: 75,
      } as unknown as OHLCData;
      expect(calculateOHLC(ticks)).toEqual(expected);
    });

    it('should handle a single tick correctly', () => {
      const ticks: Candlestick[] = [
        { timestamp: 1672531140000, price: 100, volume: 10 },
      ];
      const expected: OHLCData = {
        open: 100,
        high: 100,
        low: 100,
        close: 100,
        volume: 10,
      } as unknown as OHLCData;
      expect(calculateOHLC(ticks)).toEqual(expected);
    });
  });

  describe('groupByInterval', () => {
    it('should group candlestick data by the given interval', () => {
      const ticks: Candlestick[] = [
        { timestamp: 1672531140000, price: 100, volume: 10 },
        { timestamp: 1672531150000, price: 110, volume: 20 },
        { timestamp: 1672531200000, price: 90, volume: 30 },
        { timestamp: 1672531230000, price: 95, volume: 15 },
      ];
      const grouped = groupByInterval(ticks, roundToMinute);
      const expected = {
        1672531140000: [
          { timestamp: 1672531140000, price: 100, volume: 10 },
          { timestamp: 1672531150000, price: 110, volume: 20 },
        ],
        1672531200000: [
          { timestamp: 1672531200000, price: 90, volume: 30 },
          { timestamp: 1672531230000, price: 95, volume: 15 },
        ],
      };
      expect(grouped).toEqual(expected);
    });

    it('should handle empty candlestick data', () => {
      const ticks: Candlestick[] = [];
      const grouped = groupByInterval(ticks, roundToMinute);
      expect(grouped).toEqual({});
    });

    it('should handle a single candlestick entry', () => {
      const ticks: Candlestick[] = [
        { timestamp: 1672531140000, price: 100, volume: 10 },
      ];
      const grouped = groupByInterval(ticks, roundToMinute);
      const expected = {
        1672531140000: [{ timestamp: 1672531140000, price: 100, volume: 10 }],
      };
      expect(grouped).toEqual(expected);
    });
  });
});
