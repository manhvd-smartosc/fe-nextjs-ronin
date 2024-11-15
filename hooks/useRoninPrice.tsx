import { useContext } from 'react';
import { PriceContext } from '@/contexts/price';

const useRoninPrice = () => {
  const context = useContext(PriceContext);
  if (context === undefined) {
    throw new Error('usePrice must be used within a PriceProvider');
  }
  return context;
};

export default useRoninPrice;
