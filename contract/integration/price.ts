'use client';

import { ethers } from 'ethers';
import { pythUpgradableProxyAbi } from '../abi/pythUpgradableProxyAbi';
const pythUpgradableProxyAddress =
  process.env.NEXT_PUBLIC_PYTH_UPGRADABLE_PROXY_ADDRESS || '';
const idHashPrice = process.env.NEXT_PUBLIC_ID_HASH_CODE_PRICE || '';
const roninRpc = process.env.NEXT_PUBLIC_MAINNET_RONIN_RPC || '';

export const getPrice = async () => {
  try {
    const provider = new ethers.JsonRpcProvider(roninRpc);
    const contract = new ethers.Contract(
      pythUpgradableProxyAddress,
      pythUpgradableProxyAbi,
      provider,
    );
    const [price, , exponent] = await contract.getPrice(idHashPrice);
    return Number(price) * 10 ** Number(exponent);
  } catch (error) {
    console.error('Error fetching price:', error);
  }
};
