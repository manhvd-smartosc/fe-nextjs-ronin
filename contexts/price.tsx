import { getPrice } from '@/contract/integration';
import React, { createContext, useState, useEffect, ReactNode } from 'react';

interface PriceContextProps {
  price: number;
}

const PriceContext = createContext<PriceContextProps | undefined>(undefined);

const PriceProvider = ({ children }: { children: ReactNode }) => {
  const [price, setPrice] = useState<number>(0);

  useEffect(() => {
    let interval: any;
    const fetchPrice = async () => {
      const fetchedPrice = await getPrice();
      setPrice(fetchedPrice ?? 0);
    };
    fetchPrice();
    interval = setInterval(() => {
      fetchPrice();
    }, 10 * 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <PriceContext.Provider value={{ price }}>{children}</PriceContext.Provider>
  );
};

export { PriceProvider, PriceContext };
