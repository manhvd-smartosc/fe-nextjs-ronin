import { useEffect, useState } from 'react';
import apis from '@/apis';
import Chart from '@/components/Chart';
import { Box } from '@chakra-ui/react';
import { toast } from 'react-toastify';

interface TradingChartProps {
  address: string;
  initPrice: number;
  createdAt: number;
}

const refineTicks = (data: any, initPrice: number, createdAt: number) => {
  if (!data.length)
    return [
      {
        timestamp: createdAt,
        open: initPrice,
        high: initPrice,
        low: initPrice,
        close: initPrice,
        volume: 0,
      },
    ];
  const ticks = data.reduce((acc: any, cur: any, index: number) => {
    if (index === 0) {
      acc.push(cur);
      return acc;
    }
    const prev = acc[index - 1];
    const { close } = prev;
    const { timestamp, high, low, close: currentClose, volume } = cur;
    acc.push({
      timestamp,
      volume,
      open: close,
      close: currentClose,
      high: Math.max(close, high, low, currentClose),
      low: Math.min(close, high, low, currentClose),
    });
    return acc;
  }, []);
  return ticks;
};

const TradingChart = ({ address, initPrice, createdAt }: TradingChartProps) => {
  const [ticks, setTicks] = useState([]);

  const handleGetCandlesticks = async () => {
    if (!address) return;
    try {
      const data = await apis.candlesticks.fetchListCandlesticks({
        tokenAddress: address,
        timeframe: '1min',
        startTime: 0,
        endTime: new Date().valueOf(),
      });
      const newTicks = refineTicks(data, initPrice, createdAt).map(
        (item: any) => ({
          // time: moment(item.timestamp).format('YYYY-MM-DD HH:mm'),
          time: item.timestamp / 1000,
          open: +item.open,
          high: +item.high,
          low: +item.low,
          close: +item.close,
          volume: +item.volume,
        }),
      );
      setTicks(newTicks);
    } catch (error) {
      console.log(error);
      toast.error('Get candlesticks error');
    }
  };

  useEffect(() => {
    handleGetCandlesticks();
  }, [address]);

  return (
    <Box borderRadius="16px" backgroundColor="#171717">
      <Chart
        address={address}
        data={ticks || []}
        priceLineOptions={{}}
        customStyle={{
          height: '512px',
        }}
      />
    </Box>
  );
};

export default TradingChart;
