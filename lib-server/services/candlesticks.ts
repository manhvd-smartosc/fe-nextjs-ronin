import { from } from 'form-data';
import { CandlesTickInputData } from '../../types/models/CandlesTicks';
import { prisma } from '../prisma';
import {
  Candlestick,
  OHLCData,
  calculateOHLC,
  groupByInterval,
  roundToMinute,
} from '../../utils/ohlc';
import ApiError from '../errors/apiError';
import { Token } from '@prisma/client';
import moment from 'moment';
import { ethers } from 'ethers';

export const getCandlesTicks = async (
  candlesticksInput: CandlesTickInputData,
): Promise<OHLCData[]> => {
  let fromTime = 0;
  let toTime = Date.now();
  if (candlesticksInput.startTime) fromTime = candlesticksInput.startTime;
  if (candlesticksInput.endTime) toTime = candlesticksInput.endTime;

  const token = await prisma.token.findFirst({
    where: {
      address: {
        equals: candlesticksInput.tokenAddress.toLowerCase(),
        mode: 'insensitive',
      },
    },
  });
  if (!token) {
    throw new ApiError(
      `Token ${candlesticksInput.tokenAddress} not found`,
      404,
    );
  }

  const ticks = await prisma.candlestick.findMany({
    where: {
      token: {
        address: {
          equals: candlesticksInput.tokenAddress.toLowerCase(),
          mode: 'insensitive',
        },
      },
      timestamp: {
        gte: fromTime,
        lt: toTime,
      },
    },
  });

  let candles: OHLCData[] = [];
  if (ticks.length > 0)
    candles = ticks
      .sort((a, b) => Number(a.timestamp) - Number(b.timestamp))
      .map(
        (tick) =>
          ({
            open: Number(tick.open),
            high: Number(tick.high),
            low: Number(tick.low),
            close: Number(tick.close),
            volume: Number(tick.volume),
            timestamp: Number(tick.timestamp),
          } as unknown as OHLCData),
      );
  else candles = await aggregateCandlesticks(candlesticksInput, token);

  // get latest trades
  let maxTimestampFromCandles = fromTime;
  if (candles.length > 0)
    maxTimestampFromCandles = Math.max(...candles.map((c) => c.timestamp));

  const latestCandles = await aggregateOHLCByTokenWithRange(
    moment(maxTimestampFromCandles).add(1, 'minute').valueOf(),
    toTime,
    token.address,
  );

  return [...candles, ...latestCandles];
};

const aggregateCandlesticks = async (
  candlesticksInput: CandlesTickInputData,
  token: Token,
): Promise<OHLCData[]> => {
  let startDate = 0;
  let endDate = moment().startOf('minute').valueOf();
  if (candlesticksInput.startTime)
    startDate = moment(candlesticksInput.startTime).startOf('minute').valueOf();
  if (candlesticksInput.endTime)
    endDate = moment(candlesticksInput.endTime).startOf('minute').valueOf();

  const ohlcs = await aggregateOHLCByTokenWithRange(
    startDate,
    endDate,
    token.address,
  );

  if (ohlcs.length > 0) {
    // save to candlesticks
    await prisma.candlestick.createMany({
      data: ohlcs.map((ohlc) => ({
        open: ohlc.open,
        high: ohlc.high,
        low: ohlc.low,
        close: ohlc.close,
        volume: ohlc.volume,
        timestamp: ohlc.timestamp,
        tokenId: token.id,
      })),
    });

    return ohlcs;
  }

  return [];
};

const aggregateOHLCByTokenWithRange = async (
  fromTime: number,
  toTime: number,
  tokenAddress: string,
): Promise<OHLCData[]> => {
  // get trades from db
  const trades = await prisma.trade.findMany({
    where: {
      token: {
        address: {
          equals: tokenAddress.toLowerCase(),
          mode: 'insensitive',
        },
      },
      createdAt: {
        gte: fromTime,
        lt: toTime,
      },
    },
    orderBy: {
      createdAt: 'asc',
    },
  });

  // aggregate to candlesticks
  if (trades.length > 0) {
    const ticks = trades
      .map(
        (t): Candlestick => ({
          price: Number(ethers.formatEther(t.lastPrice)),
          timestamp: Number(t.createdAt),
          volume: Number(t.tokenAmount),
        }),
      )
      .sort((a, b) => Number(a.timestamp) - Number(b.timestamp));
    const oneMinuteGroup = groupByInterval(ticks, roundToMinute);
    const ohlcs = Object.entries(oneMinuteGroup).map(
      ([time, ticks]) =>
        ({
          ...calculateOHLC(ticks as Candlestick[]),
          timestamp: Number(time),
        } as OHLCData),
    );

    return ohlcs;
  }

  return [];
};
