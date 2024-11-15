'use client';

import { createChart } from 'lightweight-charts';
import { useEffect, useRef } from 'react';
import BigNumber from 'bignumber.js';
import { chartOption } from './config';
import { StyledChartWrapper } from './index.style';
import { AppSyncEventType, socketEmitter } from '@/lib-client/EventEmitter';

const Chart = ({
  data,
  priceLineOptions,
  address,
  customStyle,
  ...rest
}: {
  data: any;
  address: string;
  priceLineOptions: any;
  customStyle?: any;
}) => {
  const chartRef = useRef<HTMLDivElement | null>(null);
  const candleInstanceRef = useRef<any>(null);

  useEffect(() => {
    if (!chartRef.current) return;
    const chart = createChart(chartRef.current, chartOption);

    const candleSeries = chart.addCandlestickSeries({
      upColor: '#0FBE5A',
      downColor: '#EB5146',
      borderDownColor: '#EB5146',
      borderUpColor: '#0FBE5A',
      wickDownColor: '#EB5146',
      wickUpColor: '#0FBE5A',
      priceFormat: {
        type: 'price',
        minMove: 1e-15,
        precision: 15,
      },
    });

    if (data.length === 0) {
      document.querySelector('.tv-lightweight-charts table')?.remove();
      const chartContainer = document.querySelector('.tv-lightweight-charts');
      const noDataOverlay = document.createElement('div');
      noDataOverlay.style.position = 'absolute';
      noDataOverlay.style.top = '50%';
      noDataOverlay.style.left = '50%';
      noDataOverlay.style.transform = 'translate(-50%, -50%)';
      noDataOverlay.style.textAlign = 'center';
      noDataOverlay.style.color = '#F0F6FF';
      noDataOverlay.style.fontSize = '16px';
      noDataOverlay.style.pointerEvents = 'none';

      const text = document.createElement('div');
      text.textContent = 'No data here';
      noDataOverlay.appendChild(text);

      chartContainer?.appendChild(noDataOverlay);
    } else {
      candleSeries.setData(data);
    }

    chart.timeScale().fitContent();

    // Attach ResizeObserver
    const resizeObserver = new ResizeObserver((entries) => {
      if (!chartRef.current || entries[0].target !== chartRef.current) return;
      const { width, height } = entries[0].contentRect;
      chart.applyOptions({ width, height });
    });

    resizeObserver.observe(chartRef.current);
    candleInstanceRef.current = candleSeries;

    return () => {
      resizeObserver.disconnect();
      chart.remove();
    };
  }, [data]);

  useEffect(() => {
    const handleTrading = async (data: any) => {
      let thisTick = data.timestamp / 1000;
      thisTick = thisTick - (thisTick % 60);
      const thisTickPrice = new BigNumber(data.lastPrice)
        .dividedBy(1e18)
        .toNumber();
      const currentData = candleInstanceRef.current?.data() || [];
      if (currentData.length === 0) {
        const tmpData = {
          time: thisTick,
          open: thisTickPrice,
          high: thisTickPrice,
          low: thisTickPrice,
          close: thisTickPrice,
          volume: 0,
        };
        candleInstanceRef.current.update(tmpData);
      } else {
        const lastData = currentData[currentData.length - 1];
        const {
          time: prevTime,
          close: prevClose,
          open: prevOpen,
          high: prevHigh,
          low: prevLow,
        } = lastData;
        if (thisTick < prevTime) {
          return;
        }
        if (thisTick === prevTime) {
          // should update prev data
          const tmpData = {
            time: thisTick,
            open: prevOpen,
            high: Math.max(prevHigh, thisTickPrice),
            low: Math.min(prevLow, thisTickPrice),
            close: thisTickPrice,
            volume: 0,
          };
          candleInstanceRef.current.update(tmpData);
        } else {
          const tmpData = {
            time: thisTick,
            open: prevClose,
            high: thisTickPrice,
            low: thisTickPrice,
            close: thisTickPrice,
            volume: 0,
          };
          // should create new data
          candleInstanceRef.current.update(tmpData);
        }
      }
    };
    if (candleInstanceRef) {
      socketEmitter.on(
        `${address?.toLowerCase()}_${AppSyncEventType.TRADE}`,
        handleTrading,
      );
    }
    return () => {
      if (socketEmitter) {
        socketEmitter.off(
          `${address?.toLowerCase()}_${AppSyncEventType.TRADE}`,
          handleTrading,
        );
      }
    };
  }, [candleInstanceRef]);

  return <StyledChartWrapper style={customStyle} ref={chartRef} {...rest} />;
};

export default Chart;
