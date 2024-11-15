import { API_URL } from '@/constants';
import { toast } from 'react-toastify';

type GenerateNonceParams = {
  address: string;
};

async function generateNonce({ address }: GenerateNonceParams) {
  try {
    const response = await fetch(API_URL.GENERATE_NONCE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        publicAddress: address,
      }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    toast.error('Generate nonce failed');
  }
}

export { generateNonce };
