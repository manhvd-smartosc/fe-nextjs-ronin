import { getPrice } from '@/contract/utils/contract';
import { useState, useEffect } from 'react';

const useRonin = () => {
  const [price, setPrice] = useState<number | undefined>();

  useEffect(() => {
    const fetchPrice = async () => {
      const price = await getPrice();
      setPrice(price);
    };

    fetchPrice();
  }, []);

  return { price };
};

export default useRonin;
